/*   Copyright (c) 2010-2011, Diaspora Inc.  This file is
 *   licensed under the Affero General Public License version 3 or later.  See
 *   the COPYRIGHT file.
 */

var Stream = {
  selector: "#main_stream",
  nsfw_links: ".shield a",

  initialize: function() {
    Diaspora.page.directionDetector.updateBinds();
  },

  initializeLives: function(){
    Stream.setUpNsfwLinks();

    // reshare button action
    $(".reshare_button", this.selector).live("click", function(evt) {
      evt.preventDefault();
      var button = $(this),
        box = button.siblings(".reshare_box");

      if (box.length > 0) {
        button.toggleClass("active");
        box.toggle();
      }
    });
    
  },

  setUpNsfwLinks:function(){
    $(this.nsfw_links).click(function(e){
      e.preventDefault();
      $(this).parent().fadeOut();
    });
  },

  setUpAudioLinks: function() {
  }
};

$(document).ready(function() {
  if( $(Stream.selector).length == 0 ) { return }
  Stream.initializeLives();
});
