<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/*

--
-- Struttura della tabella `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `usersId` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(30) NOT NULL,
  `password` varchar(20) NOT NULL,
  `created` datetime NOT NULL,
  `token` varchar(50),
  `email` varchar(100) NOT NULL,
  PRIMARY KEY (`usersId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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
    $list = array(
      'pending' => array(),
      'running' => array(),
      'completed' => array()
    );

    $games = $game->search(array( 'player1 =' => $this->usersId,
                                  'or player2 =' => $this->usersId,
                                  'state !=' => 'completed'),'','',
                           array('date','DESC'));
    
    $completed = $game->search(array( 'player1 =' => $this->usersId,
                                      'or player2 =' => $this->usersId,
                                      'state =' => 'completed'), 10,'',
                               array('date','DESC'));
    $games = array_merge($games, $completed);

    foreach($games as $game)
    {
      if($game->player1 != $this->usersId)
      {
        $game->player2 = $game->player1;
        $game->player1 = $this->usersId;

        $userScore = $game->score2;
        $game->score2 = $game->score1;
        $game->score1 = $userScore;
      }

      $player1 = new Users($game->player1);
      $player2 = new Users($game->player2);

      $game->player1 = $player1->username;
      $game->player2 = $player2->username;


      $list[$game->state][] = $game;
    }
    
    return $list;
  }
}
