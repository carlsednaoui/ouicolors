$( document ).ready(function() {
  (function ouibounce() {

    $('html').on('mouseout.ouibounce', (function() {
      function showModal() {
        $('#ouibounce-modal').modal();
      }
      return function(e) {
        if (!(e.clientY < 20)) return;
        
        showModal();
        $('html').off('mouseout.ouibounce');
      };
    })() );

  })();

  // inject bootstrap modal css
  $('head').prepend('<style type="text/css">.modal-open{overflow:hidden}.modal{position:fixed;top:0;right:0;bottom:0;left:0;z-index:1040;display:none;overflow:auto;overflow-y:scroll}.modal.fade .modal-dialog{-webkit-transform:translate(0,-25%);-ms-transform:translate(0,-25%);transform:translate(0,-25%);-webkit-transition:-webkit-transform .3s ease-out;-moz-transition:-moz-transform .3s ease-out;-o-transition:-o-transform .3s ease-out;transition:transform .3s ease-out}.modal.in .modal-dialog{-webkit-transform:translate(0,0);-ms-transform:translate(0,0);transform:translate(0,0)}.modal-dialog{position:relative;z-index:1050;width:auto;margin:10px}.modal-content{position:relative;background-color:#fff;border:1px solid #999;border:1px solid rgba(0,0,0,0.2);border-radius:6px;outline:0;-webkit-box-shadow:0 3px 9px rgba(0,0,0,0.5);box-shadow:0 3px 9px rgba(0,0,0,0.5);background-clip:padding-box}.modal-backdrop{position:fixed;top:0;right:0;bottom:0;left:0;z-index:1030;background-color:#000}.modal-backdrop.fade{opacity:0;filter:alpha(opacity=0)}.modal-backdrop.in{opacity:.5;filter:alpha(opacity=50)}.modal-header{min-height:16.428571429px;padding:15px;border-bottom:1px solid #e5e5e5}.modal-header .close{margin-top:-2px}.modal-title{margin:0;line-height:1.428571429}.modal-body{position:relative;padding:20px;min-height:300px}.modal-footer{padding:19px 20px 20px;margin-top:15px;text-align:right;border-top:1px solid #e5e5e5}.modal-footer:before,.modal-footer:after{display:table;content:" "}.modal-footer:after{clear:both}.modal-footer:before,.modal-footer:after{display:table;content:" "}.modal-footer:after{clear:both}.modal-footer .btn+.btn{margin-bottom:0;margin-left:5px}.modal-footer .btn-group .btn+.btn{margin-left:-1px}.modal-footer .btn-block+.btn-block{margin-left:0}@media screen and (min-width:768px){.modal-dialog{width:600px;margin:30px auto}.modal-content{-webkit-box-shadow:0 5px 15px rgba(0,0,0,0.5);box-shadow:0 5px 15px rgba(0,0,0,0.5)}}.btn{display:inline-block;padding:6px 12px;margin-bottom:0;font-size:14px;font-weight:normal;line-height:1.428571429;text-align:center;white-space:nowrap;vertical-align:middle;cursor:pointer;background-image:none;border:1px solid transparent;border-radius:4px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;-o-user-select:none;user-select:none}.btn-primary{color:#fff;background-color:#428bca;border-color:#357ebd}.btn-primary:hover,.btn-primary:focus,.btn-primary:active,.btn-primary.active,.open .dropdown-toggle.btn-primary{color:#fff;background-color:#3276b1;border-color:#285e8e}</style>');

  // bootstrap modal logic
  +function ($) { "use strict";

    // MODAL CLASS DEFINITION
    // ======================

    var Modal = function (element, options) {
      this.options   = options
      this.$element  = $(element)
      this.$backdrop =
      this.isShown   = null

      if (this.options.remote) this.$element.load(this.options.remote)
    }

    Modal.DEFAULTS = {
        backdrop: true
      , keyboard: true
      , show: true
    }

    Modal.prototype.toggle = function (_relatedTarget) {
      return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
    }

    Modal.prototype.show = function (_relatedTarget) {
      var that = this
      var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

      this.$element.trigger(e)

      if (this.isShown || e.isDefaultPrevented()) return

      this.isShown = true

      this.escape()

      this.$element.on('click.dismiss.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

      this.backdrop(function () {
        var transition = $.support.transition && that.$element.hasClass('fade')

        if (!that.$element.parent().length) {
          that.$element.appendTo(document.body) // don't move modals dom position
        }

        that.$element.show()

        if (transition) {
          that.$element[0].offsetWidth // force reflow
        }

        that.$element
          .addClass('in')
          .attr('aria-hidden', false)

        that.enforceFocus()

        var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

        transition ?
          that.$element.find('.modal-dialog') // wait for modal to slide in
            .one($.support.transition.end, function () {
              that.$element.focus().trigger(e)
            })
            .emulateTransitionEnd(300) :
          that.$element.focus().trigger(e)
      })
    }

    Modal.prototype.hide = function (e) {
      if (e) e.preventDefault()

      e = $.Event('hide.bs.modal')

      this.$element.trigger(e)

      if (!this.isShown || e.isDefaultPrevented()) return

      this.isShown = false

      this.escape()

      $(document).off('focusin.bs.modal')

      this.$element
        .removeClass('in')
        .attr('aria-hidden', true)
        .off('click.dismiss.modal')

      $.support.transition && this.$element.hasClass('fade') ?
        this.$element
          .one($.support.transition.end, $.proxy(this.hideModal, this))
          .emulateTransitionEnd(300) :
        this.hideModal()
    }

    Modal.prototype.enforceFocus = function () {
      $(document)
        .off('focusin.bs.modal') // guard against infinite focus loop
        .on('focusin.bs.modal', $.proxy(function (e) {
          if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
            this.$element.focus()
          }
        }, this))
    }

    Modal.prototype.escape = function () {
      if (this.isShown && this.options.keyboard) {
        this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
          e.which == 27 && this.hide()
        }, this))
      } else if (!this.isShown) {
        this.$element.off('keyup.dismiss.bs.modal')
      }
    }

    Modal.prototype.hideModal = function () {
      var that = this
      this.$element.hide()
      this.backdrop(function () {
        that.removeBackdrop()
        that.$element.trigger('hidden.bs.modal')
      })
    }

    Modal.prototype.removeBackdrop = function () {
      this.$backdrop && this.$backdrop.remove()
      this.$backdrop = null
    }

    Modal.prototype.backdrop = function (callback) {
      var that    = this
      var animate = this.$element.hasClass('fade') ? 'fade' : ''

      if (this.isShown && this.options.backdrop) {
        var doAnimate = $.support.transition && animate

        this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
          .appendTo(document.body)

        this.$element.on('click.dismiss.modal', $.proxy(function (e) {
          if (e.target !== e.currentTarget) return
          this.options.backdrop == 'static'
            ? this.$element[0].focus.call(this.$element[0])
            : this.hide.call(this)
        }, this))

        if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

        this.$backdrop.addClass('in')

        if (!callback) return

        doAnimate ?
          this.$backdrop
            .one($.support.transition.end, callback)
            .emulateTransitionEnd(150) :
          callback()

      } else if (!this.isShown && this.$backdrop) {
        this.$backdrop.removeClass('in')

        $.support.transition && this.$element.hasClass('fade')?
          this.$backdrop
            .one($.support.transition.end, callback)
            .emulateTransitionEnd(150) :
          callback()

      } else if (callback) {
        callback()
      }
    }


    // MODAL PLUGIN DEFINITION
    // =======================

    var old = $.fn.modal

    $.fn.modal = function (option, _relatedTarget) {
      return this.each(function () {
        var $this   = $(this)
        var data    = $this.data('bs.modal')
        var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

        if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
        if (typeof option == 'string') data[option](_relatedTarget)
        else if (options.show) data.show(_relatedTarget)
      })
    }

    $.fn.modal.Constructor = Modal


    // MODAL NO CONFLICT
    // =================

    $.fn.modal.noConflict = function () {
      $.fn.modal = old
      return this
    }


    // MODAL DATA-API
    // ==============

    $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
      var $this   = $(this)
      var href    = $this.attr('href')
      var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
      var option  = $target.data('modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

      e.preventDefault()

      $target
        .modal(option, this)
        .one('hide', function () {
          $this.is(':visible') && $this.focus()
        })
    })

    $(document)
      .on('show.bs.modal',  '.modal', function () { $(document.body).addClass('modal-open') })
      .on('hidden.bs.modal', '.modal', function () { $(document.body).removeClass('modal-open') })

  }(jQuery);
});