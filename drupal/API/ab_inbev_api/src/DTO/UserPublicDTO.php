<?php

namespace Drupal\ab_inbev_api\DTO;

use Drupal\user\Entity\User;

final class UserPublicDTO
{
    private $id;
    private $firstName;
    private $lastName;
    private $mobilePhone;
    private $email;
    private $gender;
    private $statusWaitingList;

    public function __construct( User $user )
    {
        // if ( $user->hasField('field_first_name') &&  $user->get('field_first_name')->isEmpty() )
        $this->id = filter_var($user->get('uid')->value, FILTER_VALIDATE_INT);
        $this->firstName = $user->get('field_first_name')->value;
        $this->lastName = $user->get('field_last_name')->value;
        $this->mobilePhone = $user->get('field_mobile_phone')->value;
        $this->email = $user->get('mail')->value;
        $this->gender = $user->get('field_gender')->value;
        $this->statusWaitingList = $user->get('field_status_waiting_list')->value == 1;
    }
    public function getId(): int
    {
        return $this->id;
    }
    public function getFirstName(): string
    {
        return $this->firstName;
    }
    public function getLastName(): string
    {
        return $this->lastName;
    }
    public function getEmail(): string
    {
        return $this->email;
    }
    public function getStatusWaitingList(): boolean
    {
        return $this->statusWaitingList;
    }
    public function get() {
        return [
            "id" =>  $this->id ,
            "first_name" => $this->firstName ,
            "last_name" => $this->lastName ,
            "mobile_phone" => $this->mobilePhone ,
            "email" => $this->email ,
            "gender" => $this->gender,
            "status_waiting_list" => $this->statusWaitingList
        ];
    }
}