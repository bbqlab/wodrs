list = ['antani', 'perdue','ciao','peppino','sblindato','puppa','dai','fabrysfigato','cibo',
        'mangiare','freddo','morte','estate','porcoiltuodio'];

function WordList(){
  this.dictionary = [];
  this.words = [];
  this.completed = [];
  this.load();
}

WordList.prototype.each = function(callback) {
   $.each(this.words, function(id, word) {
      callback(id, word);
   });
};

WordList.prototype.load = function() {
  this.dictionary = list;
  this.init_current_words();
};

WordList.prototype.init_current_words = function() {

  this.words = this.dictionary.splice(0,6);

};

WordList.prototype.check_word = function(word) {

  console.log("Controllo la parola " + word);

  var id = this.words.indexOf(word.toLowerCase());
  if(id>=0)
  {
    this.update_word(id);
  }
  return id;

   // si
   //
   // toglilo e aggiungi in current una nuova
   // se lista globale vuota fai un altro load
};

WordList.prototype.get_word = function(id) {
  return this.words[id];
};

WordList.prototype.update_word = function(id) {
  this.words[id]=this.dictionary.pop();
};

