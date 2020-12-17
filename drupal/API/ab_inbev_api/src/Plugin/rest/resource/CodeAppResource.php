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
 *   label = @Translation("Web App - Code"),
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
    if ( !in_array("Administrator", $this->currentUser->getRoles()) ) {
      return new ModifiedResourceResponse(['message' => 'No permitido'], 405);
    }

    $this->validate($data);

    $id = $this->dbConnection->insert('ab_inbev_code')
      ->fields($data)
      ->execute();

    $created_record = $this->loadRecord($id);
    unset($created_record['owner_to']);

    // Return the newly created record in the response body.
    return new ModifiedResourceResponse($created_record, 201);

    // SELECT `cid` FROM `ab_inbev_code` WHERE 1 ORDER BY `id`
    // INTO OUTFILE '/tmp/codes.csv'
    // FIELDS TERMINATED BY ','
    // ENCLOSED BY '"'
    // LINES TERMINATED BY '\n';

    // $actual_date = time();
    // $codes = str_split( md5( time() ) , 8);
    // $codes_counter = 0;
    // $counter = 1;

    // while ( $counter <= 20000 ) {
    //   $code = $codes[ $codes_counter ];
    //   if ( !isset($code) || strlen($code) != 8 ) {
    //     $codes = str_split( md5( time() ) , 8);
    //     $codes_counter = 0;
    //     continue;
    //   }
    //   $data = [
    //     "id" => $counter,
    //     "cid" => str_shuffle( $code ),
    //     "uid" => NULL,
    //     "created" => $actual_date,
    //     "valid_until" => NULL,
    //     "owner" => "MERQUEO",
    //     "owner_from" => NULL,
    //     "owner_to" => NULL,
    //     "status" => 0
    //   ];
    //   try {
    //     $id = $this->dbConnection->insert('ab_inbev_code')
    //             ->fields($data)
    //             ->execute();
    //     if ( $id ) {
    //       $counter++;
    //     } else {
    //        echo("\r\n");
    //        echo( "Error Code : " . $code );
    //     }
    //   } catch (\Throwable $th) {
    //      echo("\r\n");
    //     echo( "Error Code : " . $code );
    //     echo( $th->getMessage() );
    //   }

    //   $codes_counter++;
    //   if ( $codes_counter >= sizeof($codes) ) {
    //     $codes = str_split( md5( time() ) , 8);
    //     $codes_counter = 0;
    //   }
    // }
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
        // PATCH OWNER
        if ( !is_array ( $data ) ) {
          throw new BadRequestHttpException('Se espera un objeto tipo [1,2,3,4...]');
        }
        if ( !in_array("administrator", $this->currentUser->getRoles()) ) {
          return new ModifiedResourceResponse(['message' => 'Rol no permitido'], 405);
        }
        $codes = [];
        $actual_date = time();
        foreach ($data as &$code) {
          try {
            $record = [
              "owner_from"=> $actual_date,
              "owner_to"=> $actual_date + (30 * 24 * 60 * 60),
            ];
            if ( $this->setOwnerDateRecord( $code, $record ) ) {
              array_push( $codes , $code );
            }
          } catch (\Throwable $th) {}
        }
        return new ModifiedResourceResponse($codes, 200);
      break;
      case 1:
        // PATCH USER
        if (!isset($data['cid']) || strlen( trim($data['cid'])) < 8 ) {
          throw new BadRequestHttpException('Codigo no válido');
        }
        $actual_date = time();
        $record = [
          "uid"=>$this->currentUser->id(),
          "used"=> $actual_date,
          "valid_until"=> $actual_date + (30 * 24 * 60 * 60),
          "status"=> 1,
        ];
        return $this->updateRecord( trim($data['cid']), $record );   
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

    
    // SELECT `cid` FROM `ab_inbev_code` WHERE 1 ORDER BY `id`
    // INTO OUTFILE '/tmp/codes.csv'
    // FIELDS TERMINATED BY ','
    // ENCLOSED BY '"'
    // LINES TERMINATED BY '\n';

    // $actual_date = time();
    // $codes = str_split( md5( time() * rand ( 100 , 999 ) ) , 8);
    // $codes_counter = 0;
    // $counter = 1;

    // while ( $counter <= 100 ) {
    //   $code = $codes[ $codes_counter ];
    //   if ( !isset($code) || strlen($code) != 8 ) {
    //     $codes = str_split( md5( time() * rand ( 100 , 999 ) ) , 8);
    //     $codes_counter = 0;
    //     continue;
    //   }
    //   $data = [
    //     "id" => $counter,
    //     "cid" => $code,
    //     "uid" => NULL,
    //     "created" => $actual_date,
    //     "valid_until" => NULL,
    //     "owner" => "MERQUEO",
    //     "owner_from" => NULL,
    //     "owner_to" => NULL,
    //     "status" => 0
    //   ];
    //   try {
    //     $id = $this->dbConnection->insert('ab_inbev_code')
    //             ->fields($data)
    //             ->execute();
    //     if ( $id ) {
    //       $counter++;
    //     } else {
    //        echo("\r\n");
    //        echo( "Error Code : " . $code );
    //     }
    //   } catch (\Throwable $th) {
    //      echo("\r\n");
    //     echo( "Error Code : " . $code );
    //     echo( $th->getMessage() );
    //   }

    //   $codes_counter++;
    //   if ( $codes_counter >= sizeof($codes) ) {
    //     $codes = str_split( md5( time() * rand ( 100 , 999 ) ) , 8);
    //     $codes_counter = 0;
    //   }
    // }
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

    if (empty($record['cid'])) {
      throw new BadRequestHttpException('cid is required.');
    }
    elseif (isset($record['cid']) && strlen($record['cid']) > 255) {
      throw new BadRequestHttpException('cid is too big.');
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
    return $this->dbConnection->query('SELECT "cid", "used", "valid_until", "status" , "owner_to" FROM {ab_inbev_code} WHERE cid = :cid', [':cid' => $cid])->fetchAssoc();
  }

  protected function loadRecords($typeQuery) {
    
    switch ($typeQuery) {
      case 0:
        // All the codes
        // Only Admin Role
        // $result = $this->dbConnection->query('SELECT "cid", "used", "valid_until", "status" FROM {ab_inbev_code} ');
        $records = [];
        // while($record = $result->fetchAssoc()) {
        //   $records[] = $record;
        // }
        return $records;
      break;

      case 1:
        // All my codes
        $result = $this->dbConnection->query('SELECT "id", "cid", "used", "valid_until", "status" FROM {ab_inbev_code} WHERE uid = :uid', [':uid' => $this->currentUser->id()]);
        $records = [];
        while($record = $result->fetchAssoc()) {
          $records[] = $record;
        }
        return $records;
      break;

      case 2:
        // All my active codes
        $result = $this->dbConnection->query('SELECT "id", "cid", "used", "valid_until", "status" FROM {ab_inbev_code} WHERE status = 1 AND uid = :uid AND valid_until < :time ', [':uid' => $this->currentUser->id(), ':time' => time()]);
        $records = [];
        while($record = $result->fetchAssoc()) {
          $records[] = $record;
        }
        return $records;
      break;

      case 3:
        // All my inactive codes
        $result = $this->dbConnection->query('SELECT "id", "cid", "used", "valid_until", "status" FROM {ab_inbev_code} WHERE status = 1 AND uid = :uid', [':uid' => $this->currentUser->id()]);
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
  protected function updateRecord($cid, array $record, $load_new = true) {

    // Make sure the record already exists.
    $code = $this->loadRecord($cid);

    if ( !$code ) {
      throw new NotFoundHttpException('Codigo no válido');
    }
    
    if ( isset($code['owner_to']) && time() > intval($code['owner_to']) ) {
      throw new NotFoundHttpException('Codigo vencido');
    }

    unset($code['owner_to']);

    if ( $code['status'] != 0 ) {
      throw new NotFoundHttpException('Codigo en uso');
    }

    //$this->validate($record);
    if ( $this->dbConnection->update('ab_inbev_code')
          ->fields($record)
          ->condition('cid', $cid)
          ->execute() == 1 ) {
          if ( $load_new ) {
            $updated_record = $this->loadRecord($cid);
            unset($updated_record['owner_to']);
            return new ModifiedResourceResponse($updated_record, 200);
          }
          return true;
      } else {
        return new ModifiedResourceResponse(["message" => "Internal Error"], 500);
      }
  }
  
  protected function setOwnerDateRecord( $cid, array $record ) {

    // Make sure the record already exists.
    $code = $this->loadRecord($cid);

    if ( !$code ) {
      throw new NotFoundHttpException('Codigo no válido');
    }
    
    if ( isset($code['owner_to']) ) {
      throw new NotFoundHttpException('Codigo con fecha ya estimada');
    }

    if ( $code['status'] != 0 ) {
      throw new NotFoundHttpException('Codigo en uso');
    }

    return ( $this->dbConnection->update('ab_inbev_code')
                  ->fields($record)
                  ->condition('cid', $cid)
                  ->execute() == 1 );
  }

}
