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
 * Represents experience records as resources.
 *
 * @RestResource (
 *   id = "ab_inbev_api_experience",
 *   label = @Translation("Web App - Experience API"),
 *   uri_paths = {
 *     "canonical" = "/api/ab-inbev-api-experience/{id}",
 *     "https://www.drupal.org/link-relations/create" = "/api/ab-inbev-api-experience"
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
class ExperienceAppResource extends ResourceBase implements DependentPluginInterface {

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

    // ADMIN
    if ( !in_array("web_app", $this->currentUser->getRoles()) ) {
      return new ModifiedResourceResponse(['message' => 'No permitido'], 405);
    }

    $this->validate_post($data);

    // SET EXP DATA
    $date = time();
    $exp_data = [
      'type' => '0',
      'title' => $data['title'],
      'description' => $data['description'],
      'location' => $data['location'],
      'url_redirect' => $data['url_redirect'],
      'url_terms' => $data['url_terms'],
      'created' => $date,
      'valid_from' => $data['valid_from'],
      'valid_to' => $data['valid_to'],
	  'activate_from' => $data['activate_from'],
	  'activate_to' => $data['activate_to'],
	  'status' => $data['status'],
   ];

    $id = $this->dbConnection->insert('ab_inbev_experience')
          ->fields($exp_data)
          ->execute();

    if ( !$id ) {
      throw new BadRequestHttpException('Error interno, intenta de nuevo mas tarde.');
    }

    // SET EXP IMAGES
    try {
      $images_folder = "public://images/experience/";
      $image = base64_decode( $data['img_desk'] );
      $file = file_save_data($image, $images_folder . $id."_desk" , FileSystemInterface::EXISTS_REPLACE);
      if ( !$file->save() ) {
        throw new BadRequestHttpException('Error guardando imagen desktop, intenta de nuevo mas tarde.');
      }
      $image = base64_decode( $data['img_mob'] );
      $file = file_save_data($image, $images_folder . $id."_mob" , FileSystemInterface::EXISTS_REPLACE);
      if ( !$file->save() ) {
        throw new BadRequestHttpException('Error guardando imagen mobile, intenta de nuevo mas tarde.');
      }
      $image = null;
    } catch (\Throwable $th) {
      throw new BadRequestHttpException('Error guardando imagen, intenta de nuevo mas tarde.');
    }

    // SET EXP STOCK DATA
    try {
      if ( is_array($data['stock']) ) {
        //PERIODICY
        foreach ($data['stock'] as &$stock) {
          $exp_stock = [
            "eid" => $id,
            "stock_initial" => $stock['stock'],
            "stock_actual" => $stock['stock'],
            "release" => $stock['date'],
            "created" => $date
          ];
          if ( !$this->dbConnection->insert('ab_inbev_exp_stock')
                                  ->fields($exp_stock)
                                  ->execute() ) {
            throw new BadRequestHttpException('Error generando el Stock, intenta de nuevo mas tarde.');
          }
        }
      } elseif ( is_numeric($data['stock']) ) {
        //UNIC STOCK
        $exp_stock = [
          "eid" => $id,
          "stock_initial" => $data['stock'],
          "stock_actual" => $data['stock'],
          "release" => $date,
          "created" => $date
        ];
        if ( !$this->dbConnection->insert('ab_inbev_exp_stock')
                                ->fields($exp_stock)
                                ->execute() ) {
          throw new BadRequestHttpException('Error generando el Stock, intenta de nuevo mas tarde.');
        }
      }
    } catch (\Throwable $th) {
      dump($th);
      throw new BadRequestHttpException('Error interno con Stock, intenta de nuevo mas tarde.');
    }

    // $this->logger->notice('New experience record has been created.');
    // $created_record = $this->loadRecord($id);

    // Return the newly created record in the response body.
    return new ModifiedResourceResponse($exp_data, 201);
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
    // ADMIN
    if ( !in_array("web_app", $this->currentUser->getRoles()) ) {
      return new ModifiedResourceResponse(['message' => $this->currentUser->getRoles()], 405);
    }

    $this->validate_patch($data);

    if ( !$this->loadRecord($data['id']) ) {
      throw new NotFoundHttpException('Experiencia no encontrada.');
    }

    // SET EXP IMAGES
    try {
      $images_folder = "public://images/experience/";
      if ( !empty($data['img_desk']) ) {
        $image = base64_decode( $data['img_desk'] );
        $file = file_save_data($image, $images_folder . $data['id']."_desk" , FileSystemInterface::EXISTS_REPLACE);
        if ( !$file->save() ) {
          throw new BadRequestHttpException('Error guardando imagen desktop, intenta de nuevo mas tarde.');
        }
      }
      if ( !empty($data['img_mob']) ) {
        $image = base64_decode( $data['img_mob'] );
        $file = file_save_data($image, $images_folder . $data['id']."_mob" , FileSystemInterface::EXISTS_REPLACE);
        if ( !$file->save() ) {
          throw new BadRequestHttpException('Error guardando imagen mobile, intenta de nuevo mas tarde.');
        }
      }
      $image = null;
    } catch (\Throwable $th) {
      dump( $th );
      throw new BadRequestHttpException('Error guardando imagen, intenta de nuevo mas tarde.');
    }

    // SET EXP DATA
    $exp_data = [
      'title' => $data['title'],
      'description' => $data['description'],
      'location' => $data['location'],
      'url_redirect' => $data['url_redirect'],
      'url_terms' => $data['url_terms'],
      'valid_from' => $data['valid_from'],
      'valid_to' => $data['valid_to'],
	  'activate_from' => $data['activate_from'],
	  'activate_to' => $data['activate_to'],
	  'status' => $data['status']
   ];

   try {
    $this->dbConnection->update('ab_inbev_experience')
          ->fields($exp_data)
          ->condition('id', $data['id'], '=')
          ->execute();
   } catch (\Throwable $th) {
      throw new BadRequestHttpException('Error interno, No se pudieron actualizar los datos, intenta de nuevo mas tarde.');
   }

    $actual_date = time();
    //SET STOCK DATA
    foreach ($data['stock'] as &$stock) {
      if ( $stock['delete'] == true  && $stock['add'] == true ) {
        // UNSENSE QUERY CONDITION
        continue;
      }

      if ( ( !isset($stock['delete']) && !isset($stock['add']) ) ||
            ( !$stock['delete'] && !$stock['add'] ) ) {
        try {
          // UPDATE QUERY CONDITION
          $exp_stock = [
            "stock_actual" => $stock['stock'],
            "release" => $stock['date'],
          ];
          $this->dbConnection->update('ab_inbev_exp_stock')
                            ->fields($exp_stock)
                            ->condition('id', $stock['id'], '=')
                            ->execute();
        } catch (\Throwable $th) {
          throw new BadRequestHttpException( $stock['id'] . ' :: Error actualizando Stock, intenta de nuevo mas tarde.');
        }
      } else if ( $stock['add'] == true ) {
        try {
          // ADD QUERY CONDITION
          $exp_stock = [
            "eid" => $data['id'],
            "stock_initial" => $stock['stock'],
            "stock_actual" => $stock['stock'],
            "release" => $stock['date'],
            "created" => $actual_date
          ];
          $this->dbConnection->insert('ab_inbev_exp_stock')
                            ->fields($exp_stock)
                            ->execute();
        } catch (\Throwable $th) {
          throw new BadRequestHttpException( 'Error insertando Stock, intenta de nuevo mas tarde.');
        }
      } else if ( $stock['delete'] == true ) {
        try {
          // DELETE QUERY CONDITION
          $this->dbConnection->delete('ab_inbev_exp_stock')
                            ->condition('id', $stock['id'], '=')
                            ->execute();
        } catch (\Throwable $th) {
          throw new BadRequestHttpException( $stock['id'] . ' :: Error eliminando Stock, intenta de nuevo mas tarde.');
        }
      }

    }

    return new ModifiedResourceResponse($exp_data, 200);
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

    // $this->dbConnection->delete('ab_inbev_experience')
    //   ->condition('id', $id)
    //   ->execute();

    // $this->logger->notice('experiences record @id has been deleted.', ['@id' => $id]);

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
  protected function validate_post($record) {
    if (!is_array($record) || count($record) == 0) {
      throw new BadRequestHttpException('No record content received.');
    }

    if (empty($record['title'])) {
      throw new BadRequestHttpException('Titulo es requerido.');
    }
    elseif (isset($record['title']) && strlen($record['title']) > 255) {
      throw new BadRequestHttpException('Titulo demasiado largo.');
    }

    if (empty($record['description'])) {
      throw new BadRequestHttpException('Descripción es requerido.');
    }
    elseif (isset($record['description']) && strlen($record['description']) > 255) {
      throw new BadRequestHttpException('Descripción demasiado larga.');
    }

    if (empty($record['location'])) {
      throw new BadRequestHttpException('Ubicación es requerida.');
    }
    elseif (isset($record['location']) && strlen($record['location']) > 255) {
      throw new BadRequestHttpException('Ubicación demasiado larga.');
    }

    if (empty($record['valid_from'])) {
      throw new BadRequestHttpException('Fecha "Valido Desde" es requerida.');
    }
    elseif (isset($record['valid_from']) && strlen($record['valid_from']) > 255) {
      throw new BadRequestHttpException('Fecha "Valido Desde" demasiado larga.');
    }

    if (empty($record['valid_to'])) {
      throw new BadRequestHttpException('Fecha "Valido Hasta" es requerida.');
    }
    elseif (isset($record['valid_to']) && strlen($record['valid_to']) > 255) {
      throw new BadRequestHttpException('Fecha "Valido Hasta" demasiado larga.');
    }

    if (empty($record['img_desk'])) {
      throw new BadRequestHttpException('La imagen desktop es requerida.');
    }

    if (empty($record['img_mob'])) {
      throw new BadRequestHttpException('La imagen mobile es requerida.');
    }

    if ( !empty($record['stock']) ) {
      // STOCK Logic
      if ( !is_array($record['stock']) && !is_numeric($record['stock']) ) {
        throw new BadRequestHttpException('Stock debe ser un numero o array.');
      }
    }
    // @DCG Add more validation rules here.
  }


  protected function validate_patch($record) {
    if (!is_array($record) || count($record) == 0) {
      throw new BadRequestHttpException('No record content received.');
    }

    if (empty($record['id'])) {
      throw new BadRequestHttpException('ID requerido.');
    }

    if (empty($record['title'])) {
      throw new BadRequestHttpException('Titulo es requerido.');
    }
    elseif (isset($record['title']) && strlen($record['title']) > 255) {
      throw new BadRequestHttpException('Titulo demasiado largo.');
    }

    if (empty($record['description'])) {
      throw new BadRequestHttpException('Descripción es requerido.');
    }
    elseif (isset($record['description']) && strlen($record['description']) > 255) {
      throw new BadRequestHttpException('Descripción demasiado larga.');
    }

    if (empty($record['location'])) {
      throw new BadRequestHttpException('Ubicación es requerida.');
    }
    elseif (isset($record['location']) && strlen($record['location']) > 255) {
      throw new BadRequestHttpException('Ubicación demasiado larga.');
    }

    if (empty($record['valid_from'])) {
      throw new BadRequestHttpException('Fecha "Valido Desde" es requerida.');
    }
    elseif (isset($record['valid_from']) && strlen($record['valid_from']) > 255) {
      throw new BadRequestHttpException('Fecha "Valido Desde" demasiado larga.');
    }

    if (empty($record['valid_to'])) {
      throw new BadRequestHttpException('Fecha "Valido Hasta" es requerida.');
    }
    elseif (isset($record['valid_to']) && strlen($record['valid_to']) > 255) {
      throw new BadRequestHttpException('Fecha "Valido Hasta" demasiado larga.');
    }

    if ( !empty($record['stock']) ) {
      // STOCK Logic
      if ( !is_array($record['stock']) ) {
        throw new BadRequestHttpException('Stock debe ser un array.');
      }
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
    $record = $this->dbConnection->query('SELECT * FROM {ab_inbev_experience} WHERE id = :id', [':id' => $id])->fetchAssoc();
    if (!$record) {
      throw new NotFoundHttpException('Experiencia no encontrada.');
    }
    return $record;
  }

  protected function loadRecords($typeQuery) {

    switch ($typeQuery) {
      case 0:
        // All the active experiences
        // $result = $this->dbConnection->query('SELECT * FROM {ab_inbev_experience} WHERE 1', []);
        $date = time();
        $result = $this->dbConnection->query('SELECT  exp.*,
                                                      sum(stock.stock_initial) as stock_initial,
                                                      sum(stock.stock_actual) as stock_actual
                                              FROM {ab_inbev_experience} exp
                                              INNER JOIN {ab_inbev_exp_stock} stock
                                                    ON exp.id = stock.eid
                                                    AND exp.valid_from <= :date
                                                    AND exp.valid_to >= :date
                                                    AND stock.release <= :date
                                              GROUP BY exp.id, exp.type, exp.status, exp.title, exp.description, exp.inscription_txt, exp.location, exp.url_redirect, exp.url_terms, exp.created, exp.valid_from, exp.valid_to, exp.activate_from, exp.activate_to, exp.status', [':date' => $date]);
        $records = [];
        $ids = [];
        while($record = $result->fetchAssoc()) {
          if ( ( is_numeric( $record["activate_from"] ) && is_numeric( $record["activate_to"] ) ) && 
                ( $date < intval($record["activate_from"]) || $date > intval($record["activate_to"]) ) ) {
            // PROXIMAMENTE
            $record['status'] = 2;
          }
          $records[] = $record;
          $ids[] = $record['id'];
        }
        $resultII = $this->dbConnection->query('SELECT exp.* FROM {ab_inbev_experience} exp
                                              WHERE exp.valid_from <= :date
                                              AND exp.valid_to >= :date
                                              AND exp.id NOT IN ( :ids ) ', [':date' => $date, ':ids' => implode(" , ", $ids)]);
        while($record = $resultII->fetchAssoc()) {
          if ( in_array($record['id'] , $ids) ) {
            continue;
          }
          $record['stock_initial'] = $record['stock_initial'] ?? "0";
          $record['stock_actual'] = $record['stock_actual'] ?? "0";
          $records[] = $record;
        }

        return $records;
      break;

      case 1:
        // All the active experiences - DETAIL - for ADMIN
        $exp_result = $this->dbConnection->query('SELECT * FROM {ab_inbev_experience}', []);
        $records = [];
        while($record = $exp_result->fetchAssoc()) {
          $stock_result = $this->dbConnection->query('SELECT `id`, `stock_initial`, `stock_actual`, `release` FROM {ab_inbev_exp_stock} WHERE eid = :eid ', [':eid' => $record['id']]);
          $stock_records = [];
          while($stock = $stock_result->fetchAssoc()) {
            $stock_records[] = $stock;
          }
          $record['stock'] = $stock_records;
          $records[] = $record;
        }
        return $records;
      break;

      case 2:
        // All the active experiences - DETAIL - for User
        $exp_result = $this->dbConnection->query('SELECT * FROM {ab_inbev_experience}', []);
        $records = [];
        while($record = $exp_result->fetchAssoc()) {
          $stock_result = $this->dbConnection->query('SELECT `id`, `type`, `status`, `title`, `description` FROM {ab_inbev_experience} WHERE eid = :eid ', [':eid' => $record['id']]);
          $stock_records = [];
          while($stock = $stock_result->fetchAssoc()) {
            $stock_records[] = $stock;
          }
          $record['stock'] = $stock_records;
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
        return $records = $this->dbConnection->query('SELECT * FROM {ab_inbev_experience} ')->fetchAssoc();
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

    $this->dbConnection->update('ab_inbev_experience')
      ->fields($record)
      ->condition('id', $id)
      ->execute();

    $this->logger->notice('experiences record @id has been updated.', ['@id' => $id]);

    // Return the updated record in the response body.
    $updated_record = $this->loadRecord($id);
    return new ModifiedResourceResponse($updated_record, 200);
  }

}
