/*!
 * Accordion 1.0.0
 *
 * Copyright © Capiner https://capiner.com
 * MIT License https://github.com/capiner/accordion/blob/master/LICENSE
 */
(function($){
	$.Accordion = function(options, element){
		this.e = $(element);
		this.o = $.extend(true, {}, $.Accordion.defaults, options);
		this.s = this.e.children('ul').children('li');
		this.init();
		this.offset()
	};
	$.Accordion.prototype = {
		init: function(){
			var self = this, $item;
			if (!self.o.opened){
				self.e.css({'display':'block','width':'0','overflow':'hidden'});
				setTimeout(function(){
					self.e.css({'display':'none','width':'','overflow':''})
				}, 1)
			}
			if (self.o.opener)
				self.s.find(self.o.openerClass).empty().append(self.o.opener);
			if (self.o.openerType == 'link')
				self.s.find(self.o.openerClass).parent().addClass('opener-link');
			if (self.o.scrollTop)
				self.e.addClass('auto-scroll');
			self.s.find(self.o.openerType == 'link' ? '.opener-link' : self.o.openerClass).on('click', function(){
				if (self.e.hasClass(self.o.hasClass)){
					self.o.openerType == 'icon' ?
						$item = $(this).parent().parent():
						$item = $(this).parent();
					self.toggle($item);
					return false
				}
			})
		},
		offset: function(){
			this.s.each(function(){
				var $item = $(this);
				$item.data({
					offset : $item.offset().top
				})
			})
		},
		toggle: function($item){
			var self = this,
				$opener = $item.find(self.o.openerClass + ':first'),
				$content = $item.children(self.o.contentClass),
				$siblings = $item.siblings().children(self.o.contentClass);
			if ($item.hasClass('active')){
				$content.stop(true,true).slideUp(self.o.speed, self.o.easing), $item.removeClass('active');
				if (self.o.opener)
					$opener.empty().append(self.o.opener);
			} else {
				$content.stop(true,true).slideDown(self.o.speed, self.o.easing), $item.addClass('active');
				if (self.o.autoCollapse){
					$siblings.stop(true,true).slideUp(self.o.speed, self.o.easing), $siblings.parent().removeClass('active');
					if (self.o.opener)
						$item.siblings().find(self.o.openerClass + ':first').empty().append(self.o.opener);
					if (self.e.hasClass('auto-scroll') && $item.hasClass('level0')){
						$(self.o.scrollClass).stop().animate({
							scrollTop : self.s.eq($item.index()).data('offset') - self.o.scrollStart
						}, self.o.scrollSpeed, self.o.scrollEasing)
					}
				} else {
					if (self.e.hasClass('auto-scroll') && $item.hasClass('level0')){
						$(self.o.scrollClass).stop().animate({
							scrollTop : self.s.eq($item.index()).offset().top - self.o.scrollStart
						}, self.o.scrollSpeed, self.o.scrollEasing)
					}
				}
				if (self.o.closer)
					$opener.empty().append(self.o.closer);
			}
		}
	};
	$.fn.Accordion = function(options){
		if (typeof options === 'string'){
			var args = Array.prototype.slice.call(arguments, 1);
			this.each(function(){
				var Accordion = $.data(this, 'Accordion');
				Accordion[options].apply(Accordion, args)
			})
		} else {
			this.each(function(){
				var Accordion = $.data(this, 'Accordion');
				if (!Accordion) $.data(this, 'Accordion', new $.Accordion(options, this))
			})
		}
		return this
	};
	$.Accordion.defaults = {
		hasClass     : 'accordion',
		openerType   : 'icon',
		openerClass  : '.opener',
		contentClass : 'ul',
		opened       : true,
		autoCollapse : true,
		speed        : 300,
		easing       : 'swing',
		scrollTop    : false,
		scrollClass  : null,
		scrollStart  : null,
		scrollSpeed  : 400,
		scrollEasing : 'swing',
		opener       : null,
		closer       : null
    }
})(jQuery)