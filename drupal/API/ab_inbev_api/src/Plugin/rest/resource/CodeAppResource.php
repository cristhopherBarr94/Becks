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
 * Represents Code App records as resources.
 *
 * @RestResource (
 *   id = "ab_inbev_api_code_app",
 *   label = @Translation("Web App - Code App"),
 *   uri_paths = {
 *     "canonical" = "/api/ab-inbev-api-code-app/{id}",
 *     "https://www.drupal.org/link-relations/create" = "/api/ab-inbev-api-code-app"
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
class CodeAppResource extends ResourceBase implements DependentPluginInterface {

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

    $id = $this->dbConnection->insert('ab_inbev_api_code_app')
      ->fields($data)
      ->execute();

    $this->logger->notice('New code app record has been created.');

    $created_record = $this->loadRecord($id);

    // Return the newly created record in the response body.
    return new ModifiedResourceResponse($created_record, 201);
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

    // Validations
    switch ( $id ) {
      case 0: 
        // PATCH DATA [ valid_until , status, owner ]
        // $this->validate($data); 
      break;
      case 1:
        // PATCH USER
        if (!isset($data['code']) || strlen($data['code']) < 8 ) {
          throw new BadRequestHttpException('Codigo no válido');
        }
        $record = [
          "uid"=>$this->currentUser->id(),
          "used"=> time(),
          "valid_until"=> time() + (30 * 24 * 60 * 60),
          "status"=> 1,
        ];
        return $this->updateRecord( $data['code'], $record );   
      break;
      default:
        throw new BadRequestHttpException('Servicio no disponible');
      break;
    }
    
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
    // $this->loadRecord($id);

    // $this->dbConnection->delete('ab_inbev_api_code_app')
    //   ->condition('id', $id)
    //   ->execute();

    // $this->logger->notice('Code App record @id has been deleted.', ['@id' => $id]);

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
    if (!is_array($record) || count($record) == 0) {
      throw new BadRequestHttpException('No record content received.');
    }

    $allowed_fields = [
      'title',
      'description',
      'price',
    ];

    if (count(array_diff(array_keys($record), $allowed_fields)) > 0) {
      throw new BadRequestHttpException('Record structure is not correct.');
    }

    if (empty($record['title'])) {
      throw new BadRequestHttpException('Title is required.');
    }
    elseif (isset($record['title']) && strlen($record['title']) > 255) {
      throw new BadRequestHttpException('Title is too big.');
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
  protected function loadRecord($cid) {
    return $this->dbConnection->query('SELECT "cid", "used", "valid_until", "status" FROM {ab_inbev_code} WHERE cid = :cid', [':cid' => $cid])->fetchAssoc();
  }

  protected function loadRecords($typeQuery) {
    
    switch ($typeQuery) {
      case 0:
        // All the codes
        // Only Admin Role
        // $result = $this->dbConnection->query('SELECT "cid", "used", "valid_until", "status" FROM {ab_inbev_code} ');
        $records = [];
        while($record = $result->fetchAssoc()) {
          $records[] = $record;
        }
        return $records;
      break;

      case 1:
        // All my codes
        $result = $this->dbConnection->query('SELECT "cid", "used", "valid_until", "status" FROM {ab_inbev_code} WHERE uid = :uid', [':uid' => $this->currentUser->id()]);
        $records = [];
        while($record = $result->fetchAssoc()) {
          $records[] = $record;
        }
        return $records;
      break;

      case 2:
        // All my active codes
        $result = $this->dbConnection->query('SELECT "cid", "used", "valid_until", "status" FROM {ab_inbev_code} WHERE status = 0 AND uid = :uid', [':uid' => $this->currentUser->id()]);
        $records = [];
        while($record = $result->fetchAssoc()) {
          $records[] = $record;
        }
        return $records;
      break;

      case 3:
        // All my inactive codes
        $result = $this->dbConnection->query('SELECT "cid", "used", "valid_until", "status" FROM {ab_inbev_code} WHERE status = 1 AND uid = :uid', [':uid' => $this->currentUser->id()]);
        $records = [];
        while($record = $result->fetchAssoc()) {
          $records[] = $record;
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
        return $records = $this->dbConnection->query('SELECT * FROM {ab_inbev_code} ')->fetchAssoc();
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
  protected function updateRecord($cid, array $record) {

    // Make sure the record already exists.
    $code = $this->loadRecord($cid);
    if ( !$code || $code['status'] != 0 ) {
      throw new NotFoundHttpException('Codigo no válido o en uso');
    }

    //$this->validate($record);
    if ( $this->dbConnection->update('ab_inbev_code')
          ->fields($record)
          ->condition('cid', $cid)
          ->execute() == 1 ) {
        $updated_record = $this->loadRecord($cid);
        return new ModifiedResourceResponse($updated_record, 200);
      } else {
        return new ModifiedResourceResponse(["message" => "Internal Error"], 500);
      }
  }

}
