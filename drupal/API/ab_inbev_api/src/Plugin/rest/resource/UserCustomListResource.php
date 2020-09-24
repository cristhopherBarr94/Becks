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

use Drupal\Core\Cache\Cache;
use Drupal\Core\Cache\CacheableMetadata;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\ab_inbev_api\DTO\UserPublicDTO;
use Drupal\ab_inbev_api\Util\Util;
use Drupal\user\Entity\User;
/**
 * Represents Web App - User List API records as resources.
 *
 * @RestResource (
 *   id = "ab_inbev_api_web_app_user_list_api",
 *   label = @Translation("Web App - User List API"),
 *   uri_paths = {
 *     "canonical" = "/api/ab-inbev-api-web-app-user-list-api",
 *     "https://www.drupal.org/link-relations/create" = "/api/ab-inbev-api-web-app-user-list-api"
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
class UserCustomListResource extends ResourceBase implements DependentPluginInterface {

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
   * Vars for the get list
   *
   */
  protected $page = 0;
  protected $pageSize = 10;
  protected $status_waiting_list = null;
  protected $order_by = null;
  protected $order_desc = null;
  protected $search = null;
  
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
                                Request $request) {
    parent::__construct($configuration, $plugin_id, $plugin_definition, $serializer_formats, $logger);
    $this->dbConnection = $db_connection;
    $this->entityTypeManager = $entity_type_manager;
    $this->currentRequest = $request;
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
      $container->get('request_stack')->getCurrentRequest()
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
    $this->page = $this->currentRequest->get('page', $this->page);
    $this->pageSize = $this->currentRequest->get('page_size', $this->pageSize);
    $this->status_waiting_list = $this->currentRequest->get('status_waiting_list');
    $this->order_by = $this->currentRequest->get('order_by');
    $this->order_desc = $this->currentRequest->get('order_desc');
    $this->search = $this->currentRequest->get('search');

    switch ( $this->order_by ) {
      case "0": $this->order_by = 'field_first_name'; break;
      case "1": $this->order_by = 'field_last_name'; break;
      case "2": $this->order_by = 'mail'; break;
      default: $this->order_by = null;
    }
    // return new ResourceResponse($this->loadRecord($id));
    $response = new ResourceResponse($this->loadRecords());
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
    $resp = [ 
      $this->currentUser->getRoles(),
      $this->currentUser->getEmail(),
      $this->currentUser->getAccountName(),
      $this->currentUser->getDisplayName(),
      $this->currentUser->isAuthenticated(),
      $this->currentUser->getLastAccessedTime()
    ];
    return new ResourceResponse($resp);
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
    $response_array = [];

    $uids = json_decode( $data->getContent() , false );
    $uids = $this->validateUids( $uids );

    if ( empty( $uids ) ) {
      echo ( "Petición no valida" );
      return new ModifiedResourceResponse(NULL, 400);
    }

    $patchUids = $this->patchWaitingListUsers( $uids );
    return new ResourceResponse($patchUids);
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
  public function delete($id, $data) {
    $uid = $this->currentRequest->get('id');

    // $uids = json_decode( $data->getContent() , false );
    // $uids = $this->validateUids( $uids );
    
    if ( empty( $uid ) ) {
      echo ( "Petición no valida" );
      return new ModifiedResourceResponse(NULL, 400);
    }
    $retUsers = array();
    
    $user_storage = $this->entityTypeManager->getStorage('user');
    $user = $user_storage->load( $uid , TRUE );
    if ( in_array("web_app", $user -> getRoles()) ) {
      array_push( $retUsers , $user->get('uid')->value );
      $user->delete();
    }

    // $users = $user_storage->loadMultiple( $uids , TRUE );
    // foreach ($users as $user) {
    //   if ( in_array("web_app", $user -> getRoles()) ) {
    //     array_push( $retUsers , $user->get('uid')->value );
    //     $user->delete();
    //   }
    // }

    // Deleted responses have an empty body.
    // echo Response
    echo( json_encode($retUsers) );
    return new ModifiedResourceResponse(NULL, 202);
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

  private function validateUids( $uids ) {
    foreach ($uids as $elementKey => $uid) {
      if ( $uid == '' || !is_numeric($uid) ) {
        unset($uids[$elementKey]);
      }
    }
    return $uids;
  }

  /**
   * Loads record from database.
   *
   *
   * @return array
   *   The database record.
   *
   * @throws \Symfony\Component\HttpKernel\Exception\NotFoundHttpException
   */
  protected function loadRecords() {
    $user_storage = \Drupal::service('entity_type.manager')->getStorage('user');

    $query = $user_storage->getQuery()
              ->condition('roles', 'web_app');

    if ( $this->status_waiting_list == 'true' ) {
      $query = $query->condition('field_status_waiting_list', TRUE );
    } else if ( $this->status_waiting_list == 'false' ) {
      $query = $query->condition('field_status_waiting_list', FALSE );
    }

    if ( $this->search != null ) { 
      $query = $query->condition('field_first_name', $this->search , 'CONTAINS' );
    }
    
    if ( $this->order_by != null ) {
      if ( $this->order_desc == 'true' ) {
        $query = $query->sort( $this->order_by, 'DESC' );
      } else {
        $query = $query->sort( $this->order_by, 'ASC' );
      }
    }

    $count_query = clone $query;
    $ids = $query
            ->range($this->page * $this->pageSize, $this->pageSize)
            ->execute();
    
    $items = [];
    if ($ids && $users = $user_storage->loadMultiple($ids)) {
      foreach ($users as $user) {
        $retUser = new UserPublicDTO(  $user );
        array_push($items , $retUser->get() );
      }
    }

    $results = [
      'total' => $count_query->count()->execute(),
      'page' => $this->page,
      'page_size' => $this->pageSize,
      'items' => $items,
    ];
    
    return $results;
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

    // // Make sure the record already exists.
    // $this->loadRecord($id);

    // $this->validate($record);

    // $this->dbConnection->update('ab_inbev_api_web_app_user_list_api')
    //   ->fields($record)
    //   ->condition('id', $id)
    //   ->execute();

    // $this->logger->notice('Web App - User List API record @id has been updated.', ['@id' => $id]);

    // // Return the updated record in the response body.
    // $updated_record = $this->loadRecord($id);
    // return new ModifiedResourceResponse($updated_record, 200);
  }

  

  /**
   * Load records and update the waiting list.
   */
  public function patchWaitingListUsers( array $uids ) {
    $retUsers = array();
    $users = User::loadMultiple( $uids , TRUE );
    foreach ($users as $user) {
      if ( in_array("web_app", $user -> getRoles()) &&
            $user->get('field_status_waiting_list')->value ) {
        array_push( $retUsers , $user->get('uid')->value );
        $pass = Util::getRandomUserPass();
        $user->setPassword($pass);
        $user->activate();
        $user->set('field_status_waiting_list', FALSE);
        if ( $user->save() ) {
          Util::sendWelcomeEmail( $user->getEmail() , $pass );
        }
      }
    }
    return $retUsers;
  }

}
