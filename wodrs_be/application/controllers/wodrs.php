<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Wodrs extends CI_Controller {
	public function index()
	{
		echo "OK";
	}

  public function login()
  {
    $username = $this->input->get('username'); 
    $password = $this->input->get('password'); 

    Wodrs::log("Logging in $username");
    Wodrs::log("Logging in $password");

    $user = new Users();
    $response = array('error'=> true,
                      'data'=> 'Authentication error');

    $user->loadFromUsername($username);

    if($user->password == $password)
    {
      $user->token = $this->session->userdata('session_id');
      $user->save();
      $response['error'] = false;
      $response['data'] = array('token'=> $user->token);
    }
    else
    {
      $response['data'] = 'Incorrect username or password';
    }

    $this->response($response);
  }

  public function logout()
  {
    $token = $this->input->get('token'); 
    $user = new Users();
    $user->loadFromToken($token);
    $user->token = '';
    $user->save();

    $this->response(array('error'=> false, 'data'=>''));
  }

  public function register()
  {
    $username = $this->input->get('username'); 
    $password = $this->input->get('password'); 

    $response = array('error'=> true, 'data' => '');

    $user = new Users();
    $user->loadFromUsername($username);

    if($user->usersId == '')
    {
      $user->username = $username;
      $user->password = $password;
      $user->email = '';
      $user->created = date("Y-m-d H:i:s");
      $user->token = $this->session->userdata('session_id');
      $user->save();
      $response['error'] = false;
      $response['data'] = array('token' => $user->token);
    }
    else
    {
      $response['data'] = 'Username already taken';
    }

    $this->response($response);
  }
  
  public function request_player()
  {
    $token = $this->input->get('token'); 

    $user = new Users();
    $user->loadFromToken($token);

    Wodrs::log("Requesting game for " . $user->username);
    $response = array('error'=> true, 'data' => '');
    
    $queue = new Queue();
    $game = new Games();

    if($queue->count($user->usersId) > 0)
    {
      Wodrs::log('Player found');
      // add new player
      $gameInfo = $queue->pop($user->usersId);

      $game->load($gameInfo->gamesId);
      $game->player2 = $user->usersId;
      $game->state = 'running';
      Wodrs::log($game);
      $game->save();
      $gameInfo->delete();

      $response['error'] = false;
      $response['data'] = array('game' => $game);
    }
    else
    {
      Wodrs::log('Player not found: enqueue');
      // player in the queue
      $game->init();
      $game->player1 = $user->usersId;
      $game->save();

      $queue->push($user, $game->gamesId);

      $response['error'] = false;
      $response['data'] = array('game' => $game);
    }

    $this->response($response);
  }


  public function start_game()
  {
    $gamesId = $this->input->get('game_id'); 
    $token = $this->input->get('token'); 

  }

  public function stop_game()
  {
    $gamesId = $this->input->get('game_id'); 

  }

  public function list_games()
  {
    $token = $this->input->get('token'); 

    $response = array('error' => false, 'data' => array('games' => array()));
    $user = new Users();
    $user->loadFromToken($token);
    if($user->usersId != '')
    {
      $games = $user->listGames();
      Wodrs::log($games);
 
      $response['data']['games'] = $games;
    }
    $this->response($response);
  }

  public function send_results()
  {
    $gamesId = $this->input->get('game_id');
    $token = $this->input->get('token');
    $score = $this->input->get('score');

    $user = new Users();
    $user->loadFromToken($token);
    Wodrs::log("Result {$user->username} for $gamesId: $score"); 

    if($user->usersId != '')
    {
      $game = new Games($gamesId);
      if($game->gamesId != '')
        $completed = $game->setScore($user, $score);
      
    }
  }

  /* private functions */
  private function response($ret)
  {
    header('Content-Type: application/json');
    if(is_object($ret))
    {
      $dict = array();
      foreach($ret as $key => $value)
      {
        $dict[$key] = $value;
      }
      
      $ret = $dict;
    }

    $content = json_encode($ret);
    header('Content-Length: ' . mb_strlen( $content, 'latin1' ));
    echo $content;
  }

  static function log($message)
  {
    if(is_array($message) or is_object($message))
    {
      $message = print_r($message, true);
    }

    log_message('error',$message);
  }
}

/* End of file wodrs.php */
/* Location: ./application/controllers/wodrs.php */
