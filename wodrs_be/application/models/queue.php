<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/*

--
-- Struttura della tabella `queue`
--

CREATE TABLE IF NOT EXISTS `queue` (
  `queueId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `timestamp` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

*/

class Queue extends BaseEntity
{
  var $queueId;
  var $userId;
  var $timestamp;

  public function push($user)
  {
  }

  public function pop()
  {
  }

  public function count()
  {
   
  }
}
