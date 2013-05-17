<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Mobile extends CI_Controller {

  private function response($ret)
  {
    header('Content-Type: application/json');
    $content = json_encode(array_map(create_function('$row','return array_values($row);'),$ret));
    header('Content-Length: ' . mb_strlen( $content, 'latin1' ));
    echo $content;
  }


  public function update_campioni(){
    $this->load->model('campioni');
    $this->response($this->campioni->search('campione,descrizione,fonte,stagione,genere,tipologia',null,100,null,null,null));
  }


  public function update_spedizionieri(){
    $this->load->model('spedizionieri');
    $this->response($this->spedizionieri->search());
  }


  public function update_clienti($responsabile)
	{
    $this->load->model('clienti');
    $responsabile = urldecode($responsabile);
    log_message('error',$responsabile);
    if($responsabile!='GIOVANNI' and $responsabile!='FIERA')
      $this->response($this->clienti->search("codcli,ragione_sociale,
                                            concat( indirizzo,', ',localita,' ',cap,' ',provincia ) as indirizzo,
                                            val_bst_1,val_bst_2,val_bch_1,val_bch_2,email_amm,email_rprod,email_rcamp,
                                            id_resp_comm,id_resp_bk,concat(codsped1,':',codsped2,':',codsped3) as spedizionieri",
                                            Array('id_resp_comm'=>$responsabile)));
    else
      $this->response($this->clienti->search("codcli,ragione_sociale,
                                            concat( indirizzo,', ',localita,' ',cap,' ',provincia ) as indirizzo,
                                            val_bst_1,val_bst_2,val_bch_1,val_bch_2,email_amm,email_rprod,email_rcamp,
                                            id_resp_comm,id_resp_bk,concat(codsped1,':',codsped2,':',codsped3) as spedizionieri"));
	
	}

  public function update_responsabili($last_update=0)
  {
    $this->load->model('responsabili');
    $this->response($this->responsabili->search());
  }

  public function update_valute($last_update=0)
  {
    $this->load->model('valute');
    $this->response($this->valute->search());
  }

  public function update_tipo_ordini()
  {
    $this->load->model('tipo_ordini');
    $this->response($this->tipo_ordini->search());
  }

  public function update_avanzamento_clienti($responsabile=null,$filename)
  {
    $this->load->model('ordini_gestionale');
    $responsabile=urldecode($responsabile);
    if($responsabile)
    {
      $query = 'SELECT ordine,stagione,cliente,UNIX_TIMESTAMP(data_ordine) data_ordine,
                  GROUP_CONCAT(articolo) articoli,
                  GROUP_CONCAT(linea) linee,
                  GROUP_CONCAT(metri_ordinati) metri_ordinati, 
                  GROUP_CONCAT(metri_annullati) metri_annullati,
                  GROUP_CONCAT(metri_assegnati) metri_assegnati,
                  GROUP_CONCAT(metri_spediti) metri_spediti,
                  GROUP_CONCAT(metri_residui) metri_residui 
                  FROM ordini_gestionale JOIN clienti ON clienti.codcli=ordini_gestionale.cliente 
                  AND clienti.id_resp_comm="'.$responsabile.'" GROUP BY ordine ORDER BY data_ordine ';

      $query = $this->db->query($query);
      $rows = $query->result_array();
      $query->free_result();

      $ret= array();

      foreach($rows as $row)
      {
        if(!isset($ret[$row['cliente']]))
          $ret[$row['cliente']] = array();
        $ret[$row['cliente']][] = array( intVal($row['ordine']),$row['stagione'],$row['data_ordine'],
                                         $row['articoli'],$row['linee'],$row['metri_ordinati'],
                                         $row['metri_annullati'],$row['metri_assegnati'],$row['metri_spediti'],
                                         $row['metri_residui'] );

      }
      header('Content-Type: application/json');
      $content = json_encode($ret);
      header('Content-Length: ' . mb_strlen( $content, 'latin1' ));
      echo $content;

    }
  }
  public function log()
  {
    log_message('error',$this->input->post('message'));
  }
}

/* End of file home.php */
/* Location: ./application/controllers/welcome.php */
