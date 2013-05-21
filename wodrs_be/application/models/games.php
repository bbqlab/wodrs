<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/*

--
-- Struttura della tabella `games`
--

CREATE TABLE IF NOT EXISTS `games` (
  `gamesId` int(11) NOT NULL AUTO_INCREMENT,
  `player1` int(11) NOT NULL,
  `player2` int(11) NOT NULL,
  `score` text NOT NULL,
  `date` datetime NOT NULL,
  `state` varchar(15) NOT NULL,
  `turn` int(11) NOT NULL,
  PRIMARY KEY (`gamesId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;


*/

class Games extends BaseEntity
{
  var $gamesId;
  var $player1;
  var $player2;
  var $score1;
  var $score2;
  var $date;
  var $state;
  var $turn;

  public function init()
  {
    $this->player1 = '';
    $this->player2 = '';
    $this->score1 = -1;
    $this->score2 = -1;
    $this->date = date("Y-m-d H:i:s");
    $this->state = 'pending';
    $this->turn = 1;
  }

  public function getTopTen()
  {
    $topten = array();
    $query = $this->db->query("SELECT *,GREATEST(score1, score2) AS winner " .
                              " FROM games WHERE state = 'completed' ". 
                              " ORDER BY winner DESC LIMIT 10");

    $games = $query->result();

    foreach($games as $game)
    {
      if($game->winner == $game->score1)
      {
        $player = new Users($game->player1);
        $topten[] = array('player' => $player->username, 
                          'score' => $game->winner);
      }
      else
      {
        $player = new Users($game->player2);
        $topten[] = array('player' => $player->username, 
                          'score' => $game->winner);
      }
    }

    return $topten;
  }

  public function getRole($user)
  {
    if($this->player1 == $user->usersId)
    {
      return 1;
    }

    return 2;
  }

  public function setScore($user, $score)
  {
    $role = $this->getRole($user);
    $scoreLabel = 'score' . $role;
    $this->$scoreLabel = $score;
    
    if($this->score1 >= 0 and $this->score2 >= 0)
    {
      $this->state = 'completed';
    }

    $this->save();
  }

  public function serializeScore()
  {
  }

  public function deserializeScore()
  {
  }
}
