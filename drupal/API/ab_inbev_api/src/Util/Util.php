<?php

namespace Drupal\ab_inbev_api\Util;


final class Util
{

    public function __construct( User $user )
    {}
    
    /**
     * Generate a Numeric Key Random 
     */
    public static function getRandomUserPass() {
        $letters = substr(str_shuffle("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"), 0, 2 );
        $numbers = substr(str_shuffle("0123456789"), 0, 4 );
        $pass = str_shuffle( $letters . $numbers );
        return $pass;
    }

    /**
     * 
    */
    public static function sendTD($form_data, $country, $brand, $campaign, $form, $unify, $production) {
        $td_env = $production ? 'prod' : 'dev';
        $http_protocol = isset($_SERVER['https']) ? 'https://' : 'http://';
        $form_data['abi_brand'] = $brand;
        $form_data['abi_campaign'] = $campaign;
        $form_data['abi_form'] = $form;
        $form_data['td_unify'] = $unify;
        $form_data['td_import_method'] = 'postback-api-1.2';
        $form_data['td_url'] = $http_protocol . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
        $form_data['td_host'] = $_SERVER['HTTP_HOST'];
        $td_country = $country;
        $td_apikey = $td_env !== 'prod' ? '9648/41e45454b77308046627548e0b4fe2ddbc0893d2' : '10086/9c06ed6fa48e0fb6952ed42773cca1cc1d43684e';
        $country_zone_mapping = array("nga"=>"africa", "zwe"=>"africa", "zaf"=>"africa", "aus"=>"apac", "chn"=>"apac", "ind"=>"apac", "jpn"=>"apac", "kor"=>"apac", "tha"=>"apac", "vnm"=>"apac", "bel"=>"eur", "fra"=>"eur", "deu"=>"eur", "ita"=>"eur", "nld"=>"eur", "rus"=>"eur", "esp"=>"eur", "ukr"=>"eur", "gbr"=>"eur", "col"=>"midam", "dom"=>"midam", "ecu"=>"midam", "slv"=>"midam", "gtm"=>"midam", "hnd"=>"midam", "mex"=>"midam", "pan"=>"midam", "per"=>"midam", "can"=>"naz", "usa"=>"naz", "arg"=>"saz", "bol"=>"saz", "bra"=>"saz", "chl"=>"saz", "ury"=>"saz");
        $td_zone = $country_zone_mapping[$td_country];
        $curl = curl_init();
        $curl_opts = array(
            CURLOPT_URL => "https://in.treasuredata.com/postback/v3/event/{$td_zone}_source/{$td_country}_web_form",
            CURLOPT_POST => true,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => array(
                'Content-Type: application/json',
                "X-TD-Write-Key: {$td_apikey}"
            ),
            CURLOPT_POSTFIELDS => json_encode($form_data)
        );
        curl_setopt_array($curl, $curl_opts);
        $response = @curl_exec($curl);
        $response_code = curl_getinfo($curl, CURLINFO_HTTP_CODE);
        curl_close($curl);
        return $response_code;
    }

    /*
    * Captcha
    */
    public static function getCaptchaHash( $value ) {
        return hash("sha512", 'setupCaptchaValidator("'. $value . '")' );
    }

    /*
    * Email
    */
    public static function sendEmail ( $type, $email , $extra ) {

        // START :: GET - TOKEN
        $curl = curl_init();
        $form_data = array(
            "clientId" => "0llu839c27lmftigqw74ot5q",
            "clientSecret" => "BfZ4cQ18LnfGiERBqvpgbvw="
        );
        $curl_opts = array(
            CURLOPT_URL => "https://auth.exacttargetapis.com/v1/requestToken",
            CURLOPT_POST => true,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => array(
                'Content-Type: application/json'
            ),
            CURLOPT_POSTFIELDS => json_encode($form_data)
        );
        curl_setopt_array($curl, $curl_opts);
        $response = json_decode(@curl_exec($curl) , true);
        $response_code = curl_getinfo($curl, CURLINFO_HTTP_CODE);
        curl_close($curl);
        // END :: GET - TOKEN

        $token = $response['accessToken'];
        switch ($type) {
            case 0:
                //WELCOME EMAIL
                $curl = curl_init();
                $form_data = array(
                    "To" => array(
                        "Address" => $email,
                        "SubscriberKey" => $email,
                        "ContactAttributes" => array(
                            "SubscriberAttributes" => array (
                                "EmailAdress" => $email,
                                "abi_name" => $extra
                            )
                        )
                    )
                );
                $curl_opts = array(
                    CURLOPT_URL => "https://www.exacttargetapis.com/messaging/v1/messageDefinitionSends/37f72e1e-0925-eb11-b819-48df37d68329/send",
                    CURLOPT_POST => true,
                    CURLOPT_RETURNTRANSFER => true,
                    CURLOPT_HTTPHEADER => array(
                        'Content-Type: application/json',
                        'Authorization: Bearer ' . $token,
                    ),
                    CURLOPT_POSTFIELDS => json_encode($form_data)
                );
                curl_setopt_array($curl, $curl_opts);
                $response = @curl_exec($curl);
                $response_code = curl_getinfo($curl, CURLINFO_HTTP_CODE);
                curl_close($curl);
            break;
            
            case 1:
                //PASSWORD EMAIL
                $curl = curl_init();
                $form_data = array(
                    "To" => array(
                        "Address" => $email,
                        "SubscriberKey" => $email,
                        "ContactAttributes" => array(
                            "SubscriberAttributes" => array (
                                "EmailAdress" => $email,
                                "abi_password" => $extra
                            )
                        )
                    )
                );
                $curl_opts = array(
                    CURLOPT_URL => "https://www.exacttargetapis.com/messaging/v1/messageDefinitionSends/a408b37c-0d25-eb11-b819-48df37d68329/send",
                    CURLOPT_POST => true,
                    CURLOPT_RETURNTRANSFER => true,
                    CURLOPT_HTTPHEADER => array(
                        'Content-Type: application/json',
                        'Authorization: Bearer ' . $token,
                    ),
                    CURLOPT_POSTFIELDS => json_encode($form_data)
                );
                curl_setopt_array($curl, $curl_opts);
                $response = @curl_exec($curl);
                $response_code = curl_getinfo($curl, CURLINFO_HTTP_CODE);
                curl_close($curl);
            break;
            
            case 2:
                //EXP EMAIL
                $curl = curl_init();
                $form_data = array(
                    "To" => array(
                        "Address" => $email,
                        "SubscriberKey" => $email,
                        "ContactAttributes" => array(
                            "SubscriberAttributes" => array (
                                "EmailAdress" => $email,
                                "abi_name" => $extra
                            )
                        )
                    )
                );
                $curl_opts = array(
                    CURLOPT_URL => "https://www.exacttargetapis.com/messaging/v1/messageDefinitionSends/40b2f38b-750d-eb11-a2f1-1402ec938a05/send",
                    CURLOPT_POST => true,
                    CURLOPT_RETURNTRANSFER => true,
                    CURLOPT_HTTPHEADER => array(
                        'Content-Type: application/json',
                        'Authorization: Bearer ' . $token,
                    ),
                    CURLOPT_POSTFIELDS => json_encode($form_data)
                );
                curl_setopt_array($curl, $curl_opts);
                $response = @curl_exec($curl);
                $response_code = curl_getinfo($curl, CURLINFO_HTTP_CODE);
                curl_close($curl);
                break;

            default:
                // $mailManager = \Drupal::service('plugin.manager.mail');
                // $module = 'ab_inbev_api';
                // $key = 'default';
                // $to = $email;
                // $params['from'] = "contact@becks.com";
                // $params['subject'] = "Bienvenido a Beck's";
                // $params['message'] = "Usuario: ". $to ." <br/> Contraseña: " . $pass ;
                // $langcode = 'es';
                // $send = TRUE;
                // $result = $mailManager->mail($module, $key, $to, $langcode, $params, NULL, $send);
            break;
        }
        
    }
        
}