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

use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\ab_inbev_api\DTO\UserPublicDTO;
use Drupal\ab_inbev_api\Util\Util;
use GuzzleHttp\Exception\RequestException;

/**
 * Represents UserCustom records as resources.
 *
 * @RestResource (
 *   id = "ab_inbev_api_usercustom",
 *   label = @Translation("Web App - User API"),
 *   uri_paths = {
 *     "canonical" = "/api/ab-inbev-api-usercustom/{text}",
 *     "https://www.drupal.org/link-relations/create" = "/api/ab-inbev-api-usercustom"
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
class UserCustomResource extends ResourceBase implements DependentPluginInterface {

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
  public function __construct(array $configuration,
                              $plugin_id, $plugin_definition,
                              array $serializer_formats,
                              LoggerInterface $logger,
                              Connection $db_connection,
                              EntityTypeManagerInterface $entity_type_manager) {
    parent::__construct($configuration, $plugin_id, $plugin_definition, $serializer_formats, $logger);
    $this->dbConnection = $db_connection;
    $this->entityTypeManager = $entity_type_manager;
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
      $container->get('entity_type.manager')
    );
  }

  /**
   * Responds to GET requests.
   *
   * @param string $text
   *   The ID of the record.
   *
   * @return \Drupal\rest\ResourceResponse
   *   The response containing the record.
   *
   * @throws \Symfony\Component\HttpKernel\Exception\HttpException
   */
  public function get($text) {
    //Devel
    // dump($text);
    // if ( $text == "list") {
    //   return new ResourceResponse([]);
    // } else {
    //   return new ResourceResponse($this->loadRecord($text));
    // }
    return new ResourceResponse($this->loadRecord($text));
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
    
    try {
      $response_array = [];
      $code = '201';
      $response_array['message'] = 'OK';

      $this->validate($data);
      $data['email'] = trim( $data['email'] );
      $data['first_name'] = trim( $data['first_name'] );
      $data['last_name'] = trim( $data['last_name'] );
      $data['mobile_phone'] = trim( $data['mobile_phone'] );
      $data['gender'] = trim( $data['gender'] );

      $lang = \Drupal::languageManager()->getCurrentLanguage()->getId();
      $user = $this->entityTypeManager->getStorage('user')->create();
      $pass = Util::getRandomUserPass();

      $user->setUsername($data['email']);
      $user->setPassword($pass);
      $user->setEmail($data['email']);
      $user->enforceIsNew();
      $user->set("name", $data['email']);
      $user->set("init", $data['email']);
      $user->set("langcode", $lang);
      $user->set("preferred_langcode", $lang);
      $user->set("preferred_admin_langcode", $lang);
      $user->set("field_first_name", $data['first_name'] );
      $user->set("field_last_name", $data['last_name'] );
      $user->set("field_mobile_phone", $data['mobile_phone'] );
      $user->set("field_gender",  $data['gender'] );
      
      if ( isset($data['type_id']) ) {
        // User from User-APP
        $user->set("field_type_id", $data['type_id'] );
        $user->set("field_id_number", $data['id_number'] );
        $user->set("field_status_waiting_list", 0);
        $user->activate();
        Util::sendWelcomeEmail( $user->getEmail() , $pass );
      } else {
        // User from Waiting-List
        $user->set("field_status_waiting_list", 1);
      }

      $user->addRole('web_app');

      $user->save();
      $user_load = $this->loadRecord($user->id());
      if ( $user_load ) {
        $result = $this->__sendTD( 
          $data['first_name'],
          $data['last_name'],
          $data['gender'] == 'M' ? 'masculino' : 'femenino',
          intval($data['mobile_phone']),
          $data['email'],
          $data['privacy'],
          $data['promo']
       );
      } else {
        $code = '502';
        $response_array['message'] = "Error Interno";
      }
    } catch (\Symfony\Component\HttpKernel\Exception\NotFoundHttpException | Exception $ex) {
      $code = '502';
      $response_array['message'] = $ex->getMessage();
    }
    return new ModifiedResourceResponse($response_array, $code);
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
    // $this->validate($data);

    if ( $id == 0 ) {
      // RECOVERY PASSWORD
      if (!isset($data['email']) || empty($data['email']) ) {
        throw new BadRequestHttpException('Hace falta el "Email"');
      }
      if ( strlen($data['email']) > 254) {
        throw new BadRequestHttpException('El "Email" sobrepasa los caracteres permitidos');
      }
      if ( !filter_var($data['email'], FILTER_VALIDATE_EMAIL) ) {
        throw new BadRequestHttpException('El "Email" no es valido');
      }

      // Validate Captcha
      if ( !isset($data['captcha']) || empty($data['captcha']) ||
            !isset($data['captcha_key']) || empty($data['captcha_key']) || 
              $data['captcha_key'] > 999999999999 ) {
        throw new BadRequestHttpException('Captcha no valido');
      }
      $hashed = Util::getCaptchaHash( $data['email'] . '-' . $data['captcha_key'] );
      if ( $data['captcha'] != $hashed ) {
        throw new BadRequestHttpException('Captcha no valido');
      }

      // Validate email for user
      $user = user_load_by_mail( $data['email'] );
      if ( !$user ) {
        throw new BadRequestHttpException('El usuario con correo "'.$data['email'].'" no existe');
      }
      $pass = Util::getRandomUserPass();
      Util::sendWelcomeEmail( $data['email'] , $pass );
    }

    return new ModifiedResourceResponse( $data['email'] , 202);
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

    // // Make sure the record still exists.
    // $this->loadRecord($id);

    // $this->dbConnection->delete('ab_inbev_api_usercustom')
    //   ->condition('id', $id)
    //   ->execute();

    // $this->logger->notice('UserCustom record @id has been deleted.', ['@id' => $id]);

    // // Deleted responses have an empty body.
    // return new ModifiedResourceResponse(NULL, 204);
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
    
    $allowed_fields = [
      'email',
      'first_name',
      'last_name',
      'mobile_phone',
      'gender',
      'email',
      'captcha',
      'captcha_key',
      'privacy',
      'promo',
      'type_id',
      'id_number'
    ];

    // if (count(array_diff(array_keys($record), $allowed_fields)) > 0) {
    //   throw new BadRequestHttpException('Petición no valida.');
    // }

    if (!isset($record['email']) || empty($record['email']) ) {
      throw new BadRequestHttpException('El usuario no puede ser registrado porque hace falta el "Email"');
    }
    if ( strlen($record['email']) > 254) {
      throw new BadRequestHttpException('El "Email" sobrepasa los caracteres permitidos');
    }
    if ( !filter_var($record['email'], FILTER_VALIDATE_EMAIL) ) {
      throw new BadRequestHttpException('El "Email" no es valido');
    }

    if (!isset($record['first_name']) || empty($record['first_name'])) {
      throw new BadRequestHttpException('El usuario no puede ser registrado porque hacen falta los "Nombres"');
    }
    if ( strlen($record['first_name']) > 60) {
      throw new BadRequestHttpException('Los "Nombres" sobrepasa los caracteres permitidos');
    }

    if (!isset($record['last_name']) || empty($record['last_name'])) {
      throw new BadRequestHttpException('El usuario no puede ser registrado porque hacen falta los "Apellidos"');
    }
    if ( strlen($record['last_name']) > 60) {
      throw new BadRequestHttpException('Los "Apellidos" sobrepasa los caracteres permitidos');
    }

    if (!isset($record['mobile_phone']) || empty($record['mobile_phone'])) {
      throw new BadRequestHttpException('El usuario no puede ser registrado porque hace falta el "Numero de celular"');
    }
    // if ( $record['mobile_phone'][0] != '+' || 
    //       !preg_match( "/^[1-9][0-9]*$/", str_replace(" ","",substr($record['mobile_phone'], 1)) ) || 
    //         strlen($record['mobile_phone']) < 10 ) {
    //   throw new BadRequestHttpException('Formato invalido para el "Numero de celular" debe ser tipo "+XX XXXXXXX" ');
    // }
    if ( !is_numeric($record['mobile_phone']) ) {
      throw new BadRequestHttpException('Formato invalido para el "Numero de celular" debe ser un numero tipo "XXXXXXXXXX" ');
    }
    if ( strlen($record['mobile_phone']) > 60) {
      throw new BadRequestHttpException('El "Numero de celular" sobrepasa los caracteres permitidos');
    }

    if (!isset($record['gender']) || empty($record['gender'])) {
      throw new BadRequestHttpException('El usuario no puede ser registrado porque hace falta el "Genero"');
    }
    if ( strlen($record['gender']) > 1 || ( $record['gender'] != 'M' && $record['gender'] != 'F') ) {
      throw new BadRequestHttpException('El "Genero" debe ser "M" (Masculino) o "F" (Femenino) ');
    } 
    
    if ( !isset($record['privacy']) || !is_bool($record['privacy']) || $record['privacy'] != true ) {
      throw new BadRequestHttpException('El usuario no puede ser registrado porque hacen falta aceptar la Política y Términos del sitio');
    }
    
    if ( isset($record['type_id']) ) {
      if ( $record['type_id'] != 'CC' && $record['type_id'] != 'CE' && $record['type_id'] != 'PA' ) {
        throw new BadRequestHttpException('El "Tipo de Documento" debe ser "CC" (Cédula de ciudadania), "CE" (Cédula de extranjeria) o "PA" (Pasaporte) ');
      }
      
      if (!isset($record['id_number']) || empty($record['id_number']) || strlen($record['id_number']) > 20 ) {
        throw new BadRequestHttpException('El usuario no puede ser registrado porque hace falta el "Número de documento"');
      }
    }

    // Validate Captcha
    if ( !isset($record['captcha']) || empty($record['captcha']) ||
          !isset($record['captcha_key']) || empty($record['captcha_key']) || 
            $record['captcha_key'] > 999999999999 ) {
      throw new BadRequestHttpException('Captcha no valido');
    }
    $hashed = Util::getCaptchaHash( $record['email'] . '-' . $record['captcha_key'] );
    if ( $record['captcha'] != $hashed ) {
      throw new BadRequestHttpException('Captcha no valido');
    }

    // Validate email for user
    $user = user_load_by_mail( $record['email'] );
    if ( $user ) {
      throw new BadRequestHttpException('El usuario no puede ser registrado porque ya existe');
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
    $user = $this->entityTypeManager->getStorage('user')->load($id);
    if (!$user) {
      throw new NotFoundHttpException('The user was not found.');
    }
    $retUser = new UserPublicDTO(  $user );
    return $retUser->get();
  }

  
  protected function loadRecordByEmail( $email ) {
    $user = $this->entityTypeManager
            ->getStorage('user')
            ->loadByProperties( ['mail' => $email ] );
    return $user;
  }

  /**
   * Private Function
   *  Analytics
   */
  private function __sendTD($name , $lastname , $gender , $phone , $email , $privacy , $promo ) {
    
    // define variable that will be used to tell the __sendTD method if it should send to the production database
    $is_production = false;
    // define the purpose variable as an empty array
    $purposes = array();
    // check whether the TC-PP checkbox is checked, and if it is, then adds it to the purpose array - informed
    if( $privacy ) $purposes[] = 'TC-PP';
    // check whether the MARKETING-ACTIVATION checkbox is checked, and if it is, then adds it to the purpose array
    if( $promo ) $purposes[] = 'MARKETING-ACTIVATION';
    // here it's possible to add additional purposes to the purpose array
    // runs the __sendTD method with parameters got from the request, it should be changed based on your form fields, country, brand, campaign, form, and whether if it's running in the production environment or not
    $data = array(
      "abi_firstname" => $name,
      "abi_lastname" => $lastname,
      "abi_gender" => $gender,
      "abi_phone" => $phone,
      "abi_email" => $email,
      "purpose_name" => $purposes,
    );

    $tdstatus = Util::sendTD(
        $data,              // form data & purposes
        'col',              // country
        'Becks',            // brand
        "BECKS_SOCIETY ",   // campaign
        "BECKS_SOCIETY ",   // form
        true,   // unify
        $is_production  // production flag
    );
    return $tdstatus;
  }
}
