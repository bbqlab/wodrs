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
  var $score;
  var $date;
  var $state;
  var $turn;

  public function init()
  {
    $this->player1 = '';
    $this->player2 = '';
    $this->score = array();
    $this->date = date("Y-m-d H:i:s");
    $this->state = 'pending';
    $this->turn = 1;
  }
}
