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
   */
  public function patch($id, $data) {
    $user = [];
    if ( $id == 0 ) {
      // PATCH PASSWORD

      if (!isset($data['password']) || strlen($data['password']) < 5 ) {
        throw new BadRequestHttpException('Mínimo 5 caracteres para la "Contraseña"');
      }

      $user = User::load($this->currentUser->id());
      $user->setPassword( $data['password'] );
      $user->save();

    } else 
      if ( $id == 1 ) {
      // PATCH DATA [ first_name , last_name, mobile_phone, birthdate, photo]
        $this->validate($data);

        $user = User::load($this->currentUser->id());
    
        $user->set("field_first_name", $data['first_name'] );
        $user->set("field_last_name", $data['last_name'] );
        $user->set("field_mobile_phone", $data['mobile_phone'] );
        $user->set("field_birthdate", $data['birthdate'] );

        $user->save();
      } else 
          if ( $id == 2 ) {

            if ( !isset($record['photo']) ) {
              throw new BadRequestHttpException('El usuario no puede ser editado porque hace falta la "Foto"');
            }

            $user = User::load($this->currentUser->id());
            
            $image = base64_decode( $data['photo'] );
            $file = file_save_data($image, $target, FileSystemInterface::EXISTS_REPLACE);
            $file->save();
            $user->set('user_picture', $file);

            $user->save();
      }

      return new ModifiedResourceResponse( $this->loadUser(), 200);
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
      throw new BadRequestHttpException('El usuario no puede ser editado porque hace falta la "Fecha de Nacimiento"');
    }
    if ( strlen($record['birthdate']) > 11) {
      throw new BadRequestHttpException('La "Fecha de Nacimiento" sobrepasa los caracteres permitidos');
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
    // "photo" => $this->currentUser->get('user_picture')->entity->url(),
    $user = User::load($this->currentUser->id());
    return [
      "roles" => $user->getRoles(),
      "email" => $user->getEmail(),
      "last_login" => $user->getLastAccessedTime(),
      "first_name" => $user->get('field_first_name')->value(),
      "last_name" => $user->get('field_last_name')->value(),
      "photo" => $user->get('user_picture')->value(),
      "mobile_phone" => $user->get('field_mobile_phone')->value(),
      "birthdate" => $user->get('field_birthdate')->value(),
      "status" => $user->get('field_status')->value()
    ];
  }

}
