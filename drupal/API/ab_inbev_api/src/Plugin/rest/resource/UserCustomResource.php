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
    return new ModifiedResourceResponse(NULL, 204);
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
      $data['full_name'] = trim( $data['full_name'] );
      $data['mobile_phone'] = trim( $data['mobile_phone'] );
      $data['gender'] = trim( $data['gender'] );

      $lang = \Drupal::languageManager()->getCurrentLanguage()->getId();
      $user = $this->entityTypeManager->getStorage('user')->create();

      if ( isset($data['password']) ) {
        $pass =  trim( trim($data['password']) );
      } else {
        $pass = Util::getRandomUserPass();
      }

      $user->setUsername($data['email']);
      $user->setPassword($pass);
      $user->setEmail($data['email']);
      $user->enforceIsNew();
      $user->set("name", $data['email']);
      $user->set("init", $data['email']);
      $user->set("langcode", $lang);
      $user->set("preferred_langcode", $lang);
      $user->set("preferred_admin_langcode", $lang);
      $user->set("field_full_name", $data['full_name'] );
      $user->set("field_mobile_phone", $data['mobile_phone'] );
      $user->set("field_gender",  $data['gender'] );
      // FASE II - FIELDS
      $user->set("field_birthdate",  $data['birthdate'] ?? "" );
      $user->set("field_type_id", $data['type_id'] ?? "" );
      $user->set("field_id_number", $data['id_number'] ?? "" );
      $user->set("field_photo_uri",  $data['photo'] ?? "" );
      $user->set("field_city",  $data['city'] ?? "" );

      $user->activate();
      
      // "type_id" field only come from User-App Form
      if ( isset($data['type_id']) ) {
        // User from User-APP
        $user->set("field_status_waiting_list", 0);
        $user->set("field_status", 0); // 0 = normal, 1 = require password change
        Util::sendEmail( 0, 
                        $user->getEmail() , 
                        $user->get('field_full_name')->value
                      );
      } else {
        // User come from Waiting-List
        $user->set("field_status_waiting_list", 1 );
      }

      $user->addRole('web_app');

      $user->save();
      $user_load = $this->loadRecord($user->id());
      if ( $user_load ) {
        $result = $this->__sendTD( 
          $data['full_name'],
          $data['city'],
          intval($data['mobile_phone']),
          $data['email'],
          $data['privacy'],
          $data['promo'],
          $data['id_number'],
          $data['cookie_td']
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
        throw new BadRequestHttpException('El "Email" no es válido');
      }

      // Validate Captcha
      if ( !isset($data['captcha']) || empty($data['captcha']) ||
            !isset($data['captcha_key']) || empty($data['captcha_key']) || 
              $data['captcha_key'] > 999999999999 ) {
        throw new BadRequestHttpException('Captcha no válido');
      }
      $hashed = Util::getCaptchaHash( $data['email'] . '-' . $data['captcha_key'] );
      if ( $data['captcha'] != $hashed ) {
        throw new BadRequestHttpException('Captcha no válido');
      }

      // Validate email for user
      $user = user_load_by_mail( $data['email'] );
      if ( !$user ) {
        throw new BadRequestHttpException('El usuario con correo "'.$data['email'].'" no existe');
      }
      $pass = Util::getRandomUserPass();

      //Change Password
      $user->setPassword($pass);
      $user->set("field_status", 1);
      $user->activate();
      $user->save();

      //Send New Password
      Util::sendEmail( 1, $data['email'] , $pass );
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

    if (!isset($record['email']) || empty($record['email']) ) {
      throw new BadRequestHttpException('El usuario no puede ser registrado porque hace falta el "Email"');
    }
    if ( strlen($record['email']) > 254) {
      throw new BadRequestHttpException('El "Email" sobrepasa los caracteres permitidos');
    }
    if ( !filter_var($record['email'], FILTER_VALIDATE_EMAIL) ) {
      throw new BadRequestHttpException('El "Email" no es válido');
    }

    if (!isset($record['full_name']) || empty($record['full_name'])) {
      throw new BadRequestHttpException('El usuario no puede ser registrado porque hacen falta los "Nombres"');
    }
    if ( strlen($record['full_name']) > 60) {
      throw new BadRequestHttpException('Los "Nombres" sobrepasa los caracteres permitidos');
    }

    if (!isset($record['mobile_phone']) || empty($record['mobile_phone'])) {
      throw new BadRequestHttpException('El usuario no puede ser registrado porque hace falta el "Número de celular"');
    }
    // if ( $record['mobile_phone'][0] != '+' || 
    //       !preg_match( "/^[1-9][0-9]*$/", str_replace(" ","",substr($record['mobile_phone'], 1)) ) || 
    //         strlen($record['mobile_phone']) < 10 ) {
    //   throw new BadRequestHttpException('Formato inválido para el "Número de celular" debe ser tipo "+XX XXXXXXX" ');
    // }
    if ( !is_numeric($record['mobile_phone']) ) {
      throw new BadRequestHttpException('Formato inválido para el "Número de celular" debe ser un Número tipo "XXXXXXXXXX" ');
    }
    if ( strlen($record['mobile_phone']) > 60) {
      throw new BadRequestHttpException('El "Número de celular" sobrepasa los caracteres permitidos');
    }

    if (!isset($record['gender']) || empty($record['gender'])) {
      throw new BadRequestHttpException('El usuario no puede ser registrado porque hace falta el "Género"');
    }
    if ( strlen($record['gender']) > 1 || ( $record['gender'] != 'M' && $record['gender'] != 'F') ) {
      throw new BadRequestHttpException('El "Género" debe ser "M" (Masculino) o "F" (Femenino) ');
    } 
    
    if ( !isset($record['privacy']) || !is_bool($record['privacy']) || $record['privacy'] != true ) {
      throw new BadRequestHttpException('El usuario no puede ser registrado porque hace falta aceptar la Política y Términos del sitio');
    }
    
    // "type_id" field from User-App Form
    if ( isset($record['type_id']) ) {
      if ( $record['type_id'] != 'CC' && $record['type_id'] != 'CE' && $record['type_id'] != 'PA' ) {
        throw new BadRequestHttpException('El "Tipo de Documento" debe ser "CC" (Cédula de ciudadania), "CE" (Cédula de extranjeria) o "PA" (Pasaporte) ');
      }
      
      if (!isset($record['id_number']) || empty($record['id_number']) || strlen($record['id_number']) > 20 ) {
        throw new BadRequestHttpException('El usuario no puede ser registrado porque hace falta el "Número de documento"');
      }
    }

    if ( isset($record['birthdate']) ) {
      try {
        $curYear = date('Y');
        $date = explode("/", $record['birthdate']);
        
        if ( intval($date[0]) < 1 || intval($date[0]) > 12 ) {
          throw new BadRequestHttpException('La "Fecha de Nacimiento" debe ser del tipo MM/DD/YYYY');
        }
        if ( intval($date[1]) < 1 || intval($date[1]) > 31 ) {
          throw new BadRequestHttpException('La "Fecha de Nacimiento" debe ser del tipo MM/DD/YYYY');
        }
        if ( intval($date[2]) < 1920 || ($curYear - intval($date[2])) < 18 ) {
          throw new BadRequestHttpException('"Fecha de Nacimiento" no valida, Debe ser mayor de edad');
        }
      } catch ( Exception $ex ) {
        throw new BadRequestHttpException('La "Fecha de Nacimiento" debe ser del tipo MM/DD/YYYY');
      }
    }
    
    // "city" field from User-App Form
    if ( isset($record['city']) ) {
      if ( empty($record['city']) || strlen($record['city']) > 250) {
        throw new BadRequestHttpException('La "Ciudad" esta vacia o sobrepasa los caracteres permitidos');
      }
    }
    
    if ( $record['password'] ) {
      if ( strlen(trim($record['password'])) < 4 ) {
        throw new BadRequestHttpException('Contraseña muy corta');
      }
    }

    // Validate Captcha
    if ( !isset($record['captcha']) || empty($record['captcha']) ||
          !isset($record['captcha_key']) || empty($record['captcha_key']) || 
            $record['captcha_key'] > 999999999999 ) {
      throw new BadRequestHttpException('Captcha no válido');
    }
    $hashed = Util::getCaptchaHash( $record['email'] . '-' . $record['captcha_key'] );
    if ( $record['captcha'] != $hashed ) {
      throw new BadRequestHttpException('Captcha no válido');
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
      throw new NotFoundHttpException('Usuario no encontrado');
    }
    $retUser = new UserPublicDTO(  $user );
    return $retUser->get();
  }

  
  protected function loadRecordByEmail( $email ) {
    $user = $this->entityTypeManager
            ->getStorage('user')
            ->loadByProperties( ['mail' => $email ] );
    if (!$user) {
      throw new NotFoundHttpException('Email no encontrado');
    }
    return $user;
  }

  /**
   * Private Function
   *  Analytics
   */
  private function __sendTD($name , $city , $phone , $email , $privacy , $promo, $id_number, $td_client ) {
    
    $country = "col";
    // define variable that will be used to tell the __sendTD method if it should send to the production database
    $is_production = preg_match("@live-cobackendbecks.pantheonsite.io@", $_SERVER['HTTP_HOST']);
    // define the purpose variable as an empty array
    $purposes = array();
    // check whether the TC-PP checkbox is checked, and if it is, then adds it to the purpose array - informed
    if( $privacy ) $purposes[] = 'TC-PP';
    // check whether the MARKETING-ACTIVATION checkbox is checked, and if it is, then adds it to the purpose array
    if( $promo ) $purposes[] = 'MARKETING-ACTIVATION';
    // here it's possible to add additional purposes to the purpose array
    // runs the __sendTD method with parameters got from the request, it should be changed based on your form fields, country, brand, campaign, form, and whether if it's running in the production environment or not
    $data = array(
      "abi_name" => $name,
      "abi_city" => $city,
      "abi_country" => $country,
      "abi_phone" => $phone,
      "abi_email" => $email,
      "abi_cpf" => $id_number,
      "td_client_id" => $td_client,
      "purpose_name" => $purposes,
    );

    $tdstatus = Util::sendTD(
        $data,              // form data & purposes
        $country,           // country
        "Becks",            // brand
        "BECKS_WEBAPP_1120",   // campaign
        "BECKS_WEBAPP_1120",   // form
        true,   // unify
        $is_production  // production flag
    );
    return $tdstatus;
  }
}
