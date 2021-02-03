<?php

namespace Drupal\ab_inbev_api\Plugin\rest\resource;

use Drupal\Component\Plugin\DependentPluginInterface;
use Drupal\Core\Database\Connection;
use Drupal\Core\Routing\BcRoute;
use Drupal\rest\ModifiedResourceResponse;
use Drupal\rest\Plugin\ResourceBase;
use Drupal\rest\ResourceResponse;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpFoundation\Request;
use Drupal\Core\Session\AccountInterface;
use Drupal\Core\File\FileSystemInterface;
use Drupal\file\Entity\File;

use Drupal\Core\Cache\Cache;
use Drupal\Core\Cache\CacheableMetadata;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\ab_inbev_api\DTO\UserPublicDTO;
use Drupal\ab_inbev_api\Util\Util;
use Drupal\user\Entity\User;

/**
 * Represents redemption records as resources.
 *
 * @RestResource (
 *   id = "ab_inbev_api_redemption",
 *   label = @Translation("Web App - Redemption API"),
 *   uri_paths = {
 *     "canonical" = "/api/ab-inbev-api-redemption/{id}",
 *     "https://www.drupal.org/link-relations/create" = "/api/ab-inbev-api-redemption"
 *   }
 * )
 *
 * @DCG
 * This plugin exposes database records as REST resources. In order to enable it
 * import the resource configuration into active configuration storage. You may
 * find an example of such configuration in the following file:
 * core/modules/rest/config/optional/rest.resource.entity.node.yml.
 * Alternatively you can make use of REST UI module.
 * @see https://www.drupal.org/project/restui
 * For accessing Drupal entities through REST interface use
 * \Drupal\rest\Plugin\rest\resource\EntityResource plugin.
 */
class RedemptionAppResource extends ResourceBase implements DependentPluginInterface {

  /**
   * The database connection.
   *
   * @var \Drupal\Core\Database\Connection
   */
  protected $dbConnection;

  /**
   * The entity type manager.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected $entityTypeManager;
  
  /**
   * A current request.
   *
   * @var \Symfony\Component\HttpFoundation\Request
   */
  protected $currentRequest;

  /**
   * The current user.
   *
   * @var Drupal\Core\Session\AccountInterface;
   */
  protected $currentUser;

  /**
   * Constructs a Drupal\rest\Plugin\rest\resource\EntityResource object.
   *
   * @param array $configuration
   *   A configuration array containing information about the plugin instance.
   * @param string $plugin_id
   *   The plugin_id for the plugin instance.
   * @param mixed $plugin_definition
   *   The plugin implementation definition.
   * @param array $serializer_formats
   *   The available serialization formats.
   * @param \Psr\Log\LoggerInterface $logger
   *   A logger instance.
   * @param \Drupal\Core\Database\Connection $db_connection
   *   The database connection.
   */
  public function __construct(  array $configuration,
                                $plugin_id, $plugin_definition,
                                array $serializer_formats,
                                LoggerInterface $logger,
                                Connection $db_connection,
                                EntityTypeManagerInterface $entity_type_manager,
                                Request $request,
                                AccountInterface $account) {
    parent::__construct($configuration, $plugin_id, $plugin_definition, $serializer_formats, $logger);
    $this->dbConnection = $db_connection;
    $this->entityTypeManager = $entity_type_manager;
    $this->currentRequest = $request;
    $this->currentUser = $account;
    
    //GMT-5
    date_default_timezone_set('America/Bogota');
  }

  /**
  * {@inheritdoc}
  */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->getParameter('serializer.formats'),
      $container->get('logger.factory')->get('rest'),
      $container->get('database'),
      $container->get('entity_type.manager'),
      $container->get('request_stack')->getCurrentRequest(),
      $container->get('current_user')
    );
  }

  /**
   * Responds to GET requests.
   *
   * @param int $id
   *   The ID of the record.
   *
   * @return \Drupal\rest\ResourceResponse
   *   The response containing the record.
   *
   * @throws \Symfony\Component\HttpKernel\Exception\HttpException
   */
  public function get($id) {
    $response = new ResourceResponse($this->loadRecords($id));
    $disable_cache = new CacheableMetadata();
    $disable_cache->setCacheContexts(['url.path', 'url.query_args']);
    $response->addCacheableDependency($disable_cache);

    return $response;
  }

  /**
   * Responds to POST requests and saves the new record.
   *
   * @param mixed $data
   *   Data to write into the database.
   *
   * @return \Drupal\rest\ModifiedResourceResponse
   *   The HTTP response object.
   */
  public function post($data) {
    $this->validate($data);
    
    $exp_result = $this->dbConnection->query('SELECT * FROM {ab_inbev_experience} WHERE id = :id LIMIT 1', [':id' => trim($data['eid'])])->fetchAssoc();

    if ( !$exp_result ) {
      throw new BadRequestHttpException('Experiencia no encontrada.');
    }

    $now = time();

    if ( $now > intval($exp_result["valid_to"]) ) {
      throw new BadRequestHttpException('Experiencia ya finalizada.');
    }

    if ( intval($exp_result["status"]) == 2 ||
          ( $now < intval($exp_result["activate_from"]) || $now > intval($exp_result["activate_to"]) ) ) {
      // Próximamente
      throw new BadRequestHttpException('Próximamente.');
    }


    
    if ( intval($exp_result["status"]) == 3) {
      // Gratuita
      $record = [
        "uid" => $this->currentUser->id(),
        "cid" => '-1',
        "eid" => trim($data['eid']),
        "created" => $now
      ];
      try {
        $id = $this->dbConnection->insert('ab_inbev_redemption')
              ->fields($record)
              ->execute();
        if ( is_numeric($id) ) {
          $storage = $this->entityTypeManager->getStorage('user');
          $user = $storage->load( $this->currentUser->id() );
          Util::sendEmail(  2, 
                            $user->getEmail() , 
                            $user->get('field_full_name')->value
          );
        }
        return new ModifiedResourceResponse($record, 201);
      } catch (\Throwable $th) {
        if ( strrpos( $th->getMessage() , '1062 Duplicate entry' ) !== false ) {
          throw new BadRequestHttpException('No se puede redimir mas de una vez la experiencia.');
        }
      }
    } else {
      // Normal
      $stock_result = $this->dbConnection->query('SELECT * FROM {ab_inbev_exp_stock} WHERE eid = :id', [':id' => trim($data['eid'])]);

      $isEmpty = false;
      $stock = null;
      while($stock = $stock_result->fetchAssoc()) {
        if ( $stock['stock_actual'] > 0 ) {
          $isEmpty = false;
          break;
        }
        $isEmpty = true;
      }

      if ( $isEmpty ) {
        throw new BadRequestHttpException('Experiencia sin stock.');
      }
      
      try {

        $record = [
          "uid" => $this->currentUser->id(),
          "cid" => trim($data['cid']),
          "eid" => trim($data['eid']),
          "created" => time()
        ];

        $id = $this->dbConnection->insert('ab_inbev_redemption')
              ->fields($record)
              ->execute();
        if ( is_numeric($id) ) {
          $this->dbConnection->query('UPDATE {ab_inbev_exp_stock} SET stock_actual = stock_actual - 1 WHERE id = :id', [':id' => $stock['id']]);
          $storage = $this->entityTypeManager->getStorage('user');
          $user = $storage->load( $this->currentUser->id() );
          Util::sendEmail(  2, 
                            $user->getEmail() , 
                            $user->get('field_full_name')->value
                          );
        }

        // $created_record = $this->loadRecord($id);
        // Return the newly created record in the response body.
        return new ModifiedResourceResponse($record, 201);
      } catch (\Throwable $th) {
        if ( strrpos( $th->getMessage() , '1062 Duplicate entry' ) !== false ) {
          throw new BadRequestHttpException('No se puede redimir mas de una vez la experiencia.');
        }
      }

    }

    throw new BadRequestHttpException('Error interno, intenta de nuevo mas tarde.');
  }

  /**
   * Responds to entity PATCH requests.
   *
   * @param int $id
   *   The ID of the record.
   * @param mixed $data
   *   Data to write into the database.
   *
   * @return \Drupal\rest\ModifiedResourceResponse
   *   The HTTP response object.
   */
  public function patch($id, $data) {
    return new ModifiedResourceResponse([], 200);
  }

  /**
   * Responds to entity DELETE requests.
   *
   * @param int $id
   *   The ID of the record.
   *
   * @return \Drupal\rest\ModifiedResourceResponse
   *   The HTTP response object.
   *
   * @throws \Symfony\Component\HttpKernel\Exception\HttpException
   */
  public function delete($id) {

    // Make sure the record still exists.
    $this->loadRecord($id);

    $this->dbConnection->delete('ab_inbev_redemption')
      ->condition('id', $id)
      ->execute();

    $this->logger->notice('redemptions record @id has been deleted.', ['@id' => $id]);

    // Deleted responses have an empty body.
    return new ModifiedResourceResponse(NULL, 204);
  }

  /**
   * {@inheritdoc}
   */
  protected function getBaseRoute($canonical_path, $method) {
    $route = parent::getBaseRoute($canonical_path, $method);

    // Change ID validation pattern.
    if ($method != 'POST') {
      $route->setRequirement('id', '\d+');
    }

    return $route;
  }

  /**
   * {@inheritdoc}
   */
  public function calculateDependencies() {
    return [];
  }

  /**
   * {@inheritdoc}
   */
  public function routes() {
    $collection = parent::routes();

    // Take out BC routes added in base class.
    // @see https://www.drupal.org/node/2865645
    // @todo Remove this in Drupal 9.
    foreach ($collection as $route_name => $route) {
      if ($route instanceof BcRoute) {
        $collection->remove($route_name);
      }
    }

    return $collection;
  }

  /**
   * Validates incoming record.
   *
   * @param mixed $record
   *   Data to validate.
   *
   * @throws \Symfony\Component\HttpKernel\Exception\BadRequestHttpException
   */
  protected function validate($record) {

    if ( !isset($record['eid']) || !is_int($record['eid']) || empty($record['eid']) ) {
      throw new BadRequestHttpException('ID de experiencia no válida.');
    }
    if ( !isset($record['cid']) || !is_int($record['cid']) || empty($record['cid']) ) {
      throw new BadRequestHttpException('ID de codigo no válido.');
    }
    // @DCG Add more validation rules here.
  }

  /**
   * Loads record from database.
   *
   * @param int $id
   *   The ID of the record.
   *
   * @return array
   *   The database record.
   *
   * @throws \Symfony\Component\HttpKernel\Exception\NotFoundHttpException
   */
  protected function loadRecord($id) {
    $record = $this->dbConnection->query('SELECT * FROM {ab_inbev_redemption} WHERE id = :id', [':id' => $id])->fetchAssoc();
    if (!$record) {
      throw new NotFoundHttpException('The record was not found.');
    }
    return $record;
  }

  protected function loadRecords($typeQuery) {
    
    switch ($typeQuery) {
      case 0:
        // ADMIN
        // All the redemptios
        // $date = new DateTime();
        // $result = $this->dbConnection->query('SELECT * FROM {ab_inbev_redemption} WHERE 1', []);
        // $records = [];
        // while($record = $result->fetchAssoc()) {
        //   $records[] = $record;
        // }
        // return $records;
        return [];
      break;

      case 1:
        // All my active redemptions
        $result = $this->dbConnection->query('SELECT * FROM {ab_inbev_redemption} WHERE `uid` = :uid', [':uid' => $this->currentUser->id()]);
        $records = [];
        while($record = $result->fetchAssoc()) {
          $records[] = intval($record['eid']);
        }
        return $records;
      break;

      default:
        throw new NotFoundHttpException('Petición no valida');
      break;
    }
  }

  protected function loadRecordsAdmin( $typeQuery ) {
    switch ( $typeQuery ) {
      case 0:
      
      case 1:
        return $records = $this->dbConnection->query('SELECT * FROM {ab_inbev_experiences} ')->fetchAssoc();
      default:
        # code...
        break;
    }
  }

  /**
   * Updates record.
   *
   * @param int $id
   *   The ID of the record.
   * @param array $record
   *   The record to validate.
   *
   * @return \Drupal\rest\ModifiedResourceResponse
   *   The HTTP response object.
   */
  protected function updateRecord($id, array $record) {

    // Make sure the record already exists.
    $this->loadRecord($id);

    $this->validate($record);

    $this->dbConnection->update('ab_inbev_redemption')
      ->fields($record)
      ->condition('id', $id)
      ->execute();

    $this->logger->notice('redemptions record @id has been updated.', ['@id' => $id]);

    // Return the updated record in the response body.
    $updated_record = $this->loadRecord($id);
    return new ModifiedResourceResponse($updated_record, 200);
  }

}
