<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/*

--
-- Struttura della tabella `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `userId` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(30) NOT NULL,
  `password` varchar(20) NOT NULL,
  `created` datetime NOT NULL,
  'token' varchar(50),
  `email` varchar(100) NOT NULL,
  PRIMARY KEY (`usersId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

*/

class Users extends BaseEntity
{
  var $usersId;
  var $username;
  var $password;
  var $created;
  var $token;
  var $email;

  public function listGames()
  {
    $game = new Games();

    $games = $game->search(array( 'player1 =' => $this->usersId,
                         'or player2 =' => $this->usersId),'','',array('created','DESC'));

    return $games;
  }
}
