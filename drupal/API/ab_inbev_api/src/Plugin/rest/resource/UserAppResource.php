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
 * Represents UserApp records as resources.
 *
 * @RestResource (
 *   id = "ab_inbev_api_user_app",
 *   label = @Translation("UserApp"),
 *   uri_paths = {
 *     "canonical" = "/api/ab-inbev-api-user-app/{id}",
 *     "https://www.drupal.org/link-relations/create" = "/api/ab-inbev-api-user-app"
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
class UserAppResource extends ResourceBase implements DependentPluginInterface {

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
    $response = new ResourceResponse($this->loadUser());
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

    // $this->validate($data);

    // $id = $this->dbConnection->insert('ab_inbev_api_user_app')
    //   ->fields($data)
    //   ->execute();

    // $this->logger->notice('New userapp record has been created.');

    // $created_record = $this->loadRecord($id);

    // Return the newly created record in the response body.
    return new ModifiedResourceResponse( null, 201);
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
   * 
   *  ISSUE FOR SIMPLE OAUTH
   *    - Auth revoke on profile update
   *    https://www.drupal.org/project/simple_oauth/issues/2946882
   * 
   * 
   */
  public function patch($id, $data) {

    // Validations
    switch ( $id ) {
      case 0: 
        // PATCH PASSWORD
        if (!isset($data['password']) || strlen($data['password']) < 5 ) {
          throw new BadRequestHttpException('Mínimo 5 caracteres para la "Contraseña"');
        }
      break;
      case 1:
        // PATCH DATA [ first_name , last_name, mobile_phone, birthdate ]
        $this->validate($data);
      break;
      case 2: 
        // PATCH Photo
        if ( !isset($data['photo']) ) {
          throw new BadRequestHttpException('El usuario no puede ser editado porque hace falta la "Foto"');
        }
      break;
      default:
        throw new BadRequestHttpException('Servicio no disponible');
      break;
    }
    
    // User Logged
    // $user = User::load($this->currentUser->id());
    // $account = $this->currentUser->getAccount();
    $response_array = [];
    
    // Logic
    switch ( $id ) {
      case 0: 
        // PATCH PASSWORD
        $user = User::load($this->currentUser->id());
        $user->setPassword( $data['password'] );
        $user->save();
        $response_array["password"] = true;
      break;
      case 1:
        // PATCH DATA [ first_name , last_name, mobile_phone, birthdate ]
        // $user->set("field_first_name", $data['first_name'] );
        // $user->set("field_last_name", $data['last_name'] );
        // $user->set("field_mobile_phone", $data['mobile_phone'] );
        // $user->set("field_birthdate", $data['birthdate'] );
        // $user->set("field_type_id", $data['type_id'] );
        // $user->set("field_id_number", $data['id_number'] );
        // $user->save();

        $response_array["first_name"] = false;
        if ( isset($data['first_name']) ) {
          try {
            $response_array["first_name"] =  $this->dbConnection->update('user__field_first_name')
                                              ->fields(['field_first_name_value' => $data['first_name']])
                                              ->condition('entity_id', $this->currentUser->id() )
                                              ->execute()  == 1;
          } catch (\Throwable $th) {}
        }
        
        $response_array["last_name"] = false;
        if ( isset($data['last_name']) ) {
          try {
            $response_array["last_name"] = $this->dbConnection->update('user__field_last_name')
                      ->fields(['field_last_name_value' => $data['last_name']])
                      ->condition('entity_id', $this->currentUser->id() )
                      ->execute()  == 1;
          } catch (\Throwable $th) {}
        }
        
        $response_array["mobile_phone"] = false;
        if ( isset($data['mobile_phone']) ) {
          try {
            $response_array["mobile_phone"] = $this->dbConnection->update('user__field_mobile_phone')
                      ->fields(['field_mobile_phone_value' => $data['mobile_phone']])
                      ->condition('entity_id', $this->currentUser->id() )
                      ->execute()  == 1;
          } catch (\Throwable $th) {}
        }
        
        $response_array["birthdate"] = false;
        if ( isset($data['birthdate']) ) {
          try {
            $response_array["birthdate"] = $this->dbConnection->update('user__field_birthdate')
                      ->fields(['field_birthdate_value' => $data['birthdate']])
                      ->condition('entity_id', $this->currentUser->id() )
                      ->execute()  == 1;
          } catch (\Throwable $th) {}
        }
        
        $response_array["type_id"] = false;
        if ( isset($data['type_id']) ) {
          try {
            $response_array["type_id"] = $this->dbConnection->update('user__field_type_id')
                      ->fields(['field_type_id_value' => $data['type_id']])
                      ->condition('entity_id', $this->currentUser->id() )
                      ->execute()  == 1;
          } catch (\Throwable $th) {}
        }

        $response_array["id_number"] = false;
        if ( isset($data['id_number']) ) {
          try {
            $response_array["id_number"] = $this->dbConnection->update('user__field_id_number')
                      ->fields(['field_id_number_value' => $data['id_number']])
                      ->condition('entity_id', $this->currentUser->id() )
                      ->execute()  == 1;
          } catch (\Throwable $th) {}
        }

      break;
      case 2: 
        // PATCH Photo
        // $user->set('user_picture', $file);
        // $response_array["photo"] = $user->save();
        try {
          $images_folder = "public://images/";
          $name = $this->currentUser->getAccount()->uuid();
          $image = base64_decode( $data['photo'] );
          $file = file_save_data($image, $images_folder . $name , FileSystemInterface::EXISTS_REPLACE);
          if ( $file->save() ) {
            $url = $file->url();
            $uri = substr( $url , strpos($url, '/sites/') );
            if ( $this->dbConnection->update('user__field_photo_uri')
                                        ->fields(['field_photo_uri_value' => $uri ])
                                        ->condition('entity_id', $this->currentUser->id() )
                                        ->execute() == 0 ) 
            {
              // IF NOT UPDATE , TRYING INSERT
              $response_array["photo"] = $this->dbConnection->insert('user__field_photo_uri')
                                          ->fields([
                                                'bundle ' => 'user' ,
                                                'entity_id' => $this->currentUser->id() ,
                                                'revision_id ' => $this->currentUser->id() ,
                                                'langcode ' => $this->currentUser->getPreferredLangcode() ,
                                                'delta ' => 0 ,
                                                'field_photo_uri_value' => $uri
                                          ])
                                          ->execute() >= 0;
            } else {
              $response_array["photo"] = true;
            }
          } else {
            $response_array["photo"] = false;
          }
        } catch ( Exception $ex ) {
          return new ModifiedResourceResponse( ["message" => $ex->getMessage() ], 500);
        }
      break;
    }

    return new ModifiedResourceResponse( $response_array, 200);
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

    switch ( $id ) {
      case 2: {
          $images_folder = "public://images/";
          $name = $this->currentUser->getAccount()->uuid();
          $image = base64_decode( '' );
          $file = file_save_data($image, $images_folder . $name , FileSystemInterface::EXISTS_REPLACE);
          if ( $file->save() ) {
            $this->dbConnection->update('user__field_photo_uri')
                              ->fields(['field_photo_uri_value' => '' ])
                              ->condition('entity_id', $this->currentUser->id() )
                              ->execute();
          }
        break;
      }
    }

    // Make sure the record still exists.
    // $this->loadRecord($id);

    // $this->dbConnection->delete('ab_inbev_api_user_app')
    //   ->condition('id', $id)
    //   ->execute();

    // $this->logger->notice('UserApp record @id has been deleted.', ['@id' => $id]);

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
      throw new BadRequestHttpException('Petición no valida.');
    }

    if (!isset($record['birthdate']) || empty($record['birthdate']) ) {
      throw new BadRequestHttpException('El usuario no puede ser editado porque hace falta la "Fecha de Nacimiento" tipo MM/DD/YYYY');
    }
    if ( strlen($record['birthdate']) > 11) {
      throw new BadRequestHttpException('La "Fecha de Nacimiento" debe ser del tipo MM/DD/YYYY');
    }
    try {
      $curYear = date('Y');
      $date = explode("/", $record['birthdate']);

      if ( intval($date[0]) < 1 || intval($date[0]) > 12 ) {
        throw new BadRequestHttpException('La "Fecha de Nacimiento" debe ser del tipo MM/DD/YYYY');
      }
      if ( intval($date[1]) < 1 || intval($date[1]) > 31 ) {
        throw new BadRequestHttpException('La "Fecha de Nacimiento" debe ser del tipo MM/DD/YYYY');
      }
      if ( intval($date[2]) < 1920 || ($curYear - intval($date[2]) ) < 18 ) {
        throw new BadRequestHttpException('"Fecha de Nacimiento" no valida, Debe ser mayor de edad');
      }
    } catch ( Exception $ex ) {
      throw new BadRequestHttpException('La "Fecha de Nacimiento" debe ser del tipo MM/DD/YYYY');
    }

    if (!isset($record['first_name']) || empty($record['first_name'])) {
      throw new BadRequestHttpException('El usuario no puede ser editado porque hacen falta los "Nombres"');
    }
    if ( strlen($record['first_name']) > 60) {
      throw new BadRequestHttpException('Los "Nombres" sobrepasan los caracteres permitidos');
    }

    if (!isset($record['last_name']) || empty($record['last_name'])) {
      throw new BadRequestHttpException('El usuario no puede ser editado porque hacen falta los "Apellidos"');
    }
    if ( strlen($record['last_name']) > 60) {
      throw new BadRequestHttpException('Los "Apellidos" sobrepasan los caracteres permitidos');
    }

    if (!isset($record['mobile_phone']) || empty($record['mobile_phone'])) {
      throw new BadRequestHttpException('El usuario no puede ser editado porque hace falta el "Número de celular"');
    }

    if ( isset($record['type_id']) && $record['type_id'] != 'CC' && $record['type_id'] != 'CE' && $record['type_id'] != 'PA' ) {
      throw new BadRequestHttpException('El "Tipo de Documento" debe ser "CC" (Cédula de ciudadania), "CE" (Cédula de extranjeria) o "PA" (Pasaporte) ');
    }

    if ( isset($record['id_number']) && (empty($record['id_number']) || strlen($record['id_number']) > 20) ) {
      throw new BadRequestHttpException('El usuario no puede ser registrado porque hace falta el "Número de documento"');
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
    $record = $this->dbConnection->query('SELECT * FROM {ab_inbev_api_user_app} WHERE id = :id', [':id' => $id])->fetchAssoc();
    if (!$record) {
      throw new NotFoundHttpException('The record was not found.');
    }
    return $record;
  }

  protected function loadUser() {
    // "photo" => $user->get('user_picture')->entity->url(),
    $user = User::load($this->currentUser->id());
    return [
      "roles" => $user->getRoles(),
      "email" => $user->getEmail(),
      "last_login" => $user->getLastAccessedTime(),
      "first_name" => $user->get('field_first_name')->value,
      "last_name" => $user->get('field_last_name')->value,
      "photo" => $user->get('field_photo_uri')->value,
      "mobile_phone" => $user->get('field_mobile_phone')->value,
      "birthdate" => $user->get('field_birthdate')->value,
      "gender" => $user->get('field_gender')->value,
      "type_id" => $user->get('field_type_id')->value,
      "id_number" => $user->get('field_id_number')->value,
      "status" => $user->get('field_status')->value,
    ];
  }

}
