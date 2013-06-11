<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/*


*/

class Stats extends BaseEntity
{
  var $statsId;
  var $gamesId;
  var $usersId;
  var $key_pressed;
  var $key_good;
  var $key_bad;


  public function evaluate($user, $game, $stats)
  {
    $this->gamesId = $game->gamesId;
    $this->usersId = $user->usersId;

    $this->key_pressed = $stats['key_pressed'];
    $this->key_good = $stats['key_good'];
    $this->key_bad = $stats['key_bad'];

    $this->save();
  }
}
