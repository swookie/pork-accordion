/**
 * pork-accordion v0.1
 *
 * @author Simon Chung - https://github.com/thesimonchung
 *
 * Released under the GPL V2 License
 * http://opensource.org/licenses/GPL-2.0
 *
 * Github https://github.com/thesimonchung/pork-accordion
 * Version 0.1
 */
(function(window, $, undefined) {
	'use strict';

	var PorkAccordion = function(elem) {
		if (window === this) {
			return new PorkAccordion(elem);
		}
		if (!elem || !$(elem)) {
			return false;
		}
		this._self = this;
		this._$accordion = $(elem);
		this._$sections = null;
		this._$openedSections = [];
		this._options = {
			toggleElem: 'li > .header',
			targetElem: 'li > .content',
			openLimit: 1,
			allowAllClosed: false,
			duration: 400,
			easing: 'swing'
		};
		this._animateOptions = {};
		return this;
	};

	PorkAccordion.fn = PorkAccordion.prototype = {
		init: function(options) {
			$.extend(this._options, options);
			$.extend(this._animateOptions, {
				duration: this._options.duration,
				easing: this._options.easing
			});
			this._$sections = this._$accordion.find(this._options.toggleElem);
			this._$sections.on('click', $.proxy(this.toggleSection, this));
		},

		openSection: function(section, animate) {
			var $section = $(section);
			var $targetSection = $(section).siblings(this._options.targetElem);
			if ($section && $targetSection && this._options.openLimit) {
				if (this._options.openLimit === 1) {
					// only allow one section opened at a time, close all and open new section
					this.closeAll(true);
				} else if (this._$openedSections.length >= this._options.openLimit) {
					// already at max sections opened
					return false;
				}
			}
			this._$openedSections.push($section.get(0));
			if (animate) {
				$section.parent().addClass('accordion-open');
				$targetSection.slideDown(this._animateOptions);
			} else {
				$section.parent().addClass('accordion-open');
				$targetSection.show();
			}
		},

		closeSection: function(section, animate, forceCloseAll) {
			if (!this._options.allowAllClosed && !forceCloseAll) {
				if (this._$openedSections.length <= 1) {
					return;
				}
			}
			var $section = $(section);
			var $targetSection = $(section).siblings(this._options.targetElem);
			for (var i = 0; i < this._$openedSections.length; i++) {
				if ($section.is(this._$openedSections[i])) {
					this._$openedSections.splice(i, 1);
					break;
				}
			}
			if (animate) {
				$targetSection.slideUp(
					$.extend({}, this._animateOptions, {
						complete: function() {
							$section.parent().removeClass('accordion-open');
						}
					}));
			} else {
				$targetSection.hide();
				$section.parent().removeClass('accordion-open');
			}
		},

		toggleSection: function(section) {
			if (section.delegateTarget) {
				// 'section' is a jQuery event; rescope section to dom element
				section = section.delegateTarget;
			}
			var $toggler = $(section);
			var $targetSection = $toggler.siblings(this._options.targetElem);
			if ($targetSection.is(':visible')) {
				this.closeSection(section, true);
			} else {
				this.openSection(section, true);
			}
		},

		closeAll: function(animate) {
			for (var i = 0; i < this._$sections.length; i++) {
				this.closeSection(this._$sections[i], animate, true);
			}
		}
	};
	window.PorkAccordion = PorkAccordion;
})(window, jQuery);
