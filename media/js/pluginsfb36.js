// usage: log('inside coolFunc', this, arguments);
// paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
window.log = function f() { log.history = log.history || []; log.history.push(arguments); if (this.console) { var args = arguments, newarr; args.callee = args.callee.caller; newarr = [].slice.call(args); if (typeof console.log === 'object') log.apply.call(console.log, console, newarr); else console.log.apply(console, newarr); } };

// make it safe to use console.log always
(function (a) { function b() { } for (var c = "assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","), d; !!(d = c.pop()); ) { a[d] = a[d] || b; } })
(function () { try { console.log(); return window.console; } catch (a) { return (window.console = {}); } } ());

/*
.detectEnter() - Binds a custom 'keyenter' event
Swift Collective - Tyler Vigeant
*/
(function ($) {
	$.fn.detectEnter = function () {
		return $(this).each(function () {
			$(this).bind('keyup', function (event) {
				var code = (event.keyCode ? event.keyCode : event.which);
				if (code == 13) { // Return/Enter
					event.preventDefault();
					$(this).trigger('keyenter');
				}
			});
		});
	};
})(jQuery);


/*
Delayed for jQuery - A plug-in to delay and/or debounce event handlers
http://www.theloveofcode.com/jquery/delayed/
https://github.com/theloveofcode/delayed-for-jquery
Copyright 2012 Tyler Vigeant <tyler@theloveofcode.com>
Released under the MIT and GPL licenses.
*/
(function ($) { TLOC_Delayed = { functions: {}, arguments: {}, originals: {}, debounce_threshhold: 100, delayed: function (types, params, selector, data, fn, one) { var origFn, type; if (typeof types === "object") { if (typeof selector !== "string") { data = data || selector; selector = undefined } for (type in types) { this.delayed(type, selector, data, types[type]) } return this } if (data == null && fn == null) { fn = selector; data = selector = undefined } else if (fn == null) { if (typeof selector === "string") { fn = data; data = undefined } else { fn = data; data = selector; selector = undefined } } if (fn === false) { fn = returnFalse } else if (!fn) { return this } if (typeof params != 'object') { params = { delay: params} } if (typeof params.delay == 'undefined') { return false } origFn = fn; fn = function (event) { if (params.preventDefault) { event.preventDefault() } if (params.stopPropagation) { event.stopPropagation() } if (params.stopImmediatePropagation) { event.stopImmediatePropagation() } TLOC_Delayed.arguments[origFn.guid] = [this, arguments]; if (params.delay == 'debounce') { window.clearTimeout(TLOC_Delayed.functions[origFn.guid]); delay_ms = TLOC_Delayed.debounce_threshhold } else { delay_ms = params.delay } if (one === 1) { jQuery().off(event) } else if (one === 'first') { $(event.delegateTarget).removeDelay(types, selector, fn) } TLOC_Delayed.functions[origFn.guid] = window.setTimeout(function () { return origFn.apply(TLOC_Delayed.arguments[origFn.guid][0], TLOC_Delayed.arguments[origFn.guid][1]) }, delay_ms) }; fn.guid = origFn.guid || (origFn.guid = jQuery.guid++); TLOC_Delayed.originals[fn.guid] = origFn; return this.each(function () { jQuery.event.add(this, types, fn, data, selector) }) }, delayedOne: function (types, params, selector, data, fn) { return this.delayed(types, params, selector, data, fn, 1) }, delayedFirst: function (types, params, selector, data, fn) { return this.delayed(types, params, selector, data, fn, 'first') }, get_events: function (elem, types, selector, fn) { var events = [], rtypenamespace = /^([^\.]*)?(?:\.(.+))?$/; if (selector === false || typeof selector === "function") { fn = selector; selector = undefined } if (fn === false) { fn = returnFalse } types = types.replace(/(?:^|\s)hover(\.\S+)?\b/, "mouseenter$1 mouseleave$1") || ""; types = jQuery.trim(types).split(" "); for (var t = 0; t < types.length; t++) { tns = rtypenamespace.exec(types[t]) || []; type = origType = tns[1]; eventType = $(elem).data('events')[type] || []; for (var i in eventType) { e = eventType[i]; if (e.namespace == tns[2] || typeof (tns[2]) == 'undefined') { if (selector) { if (e.selector == selector) { if (fn) { if (e.handler == fn) { events[events.length] = e } } else { events[events.length] = e } } } else { events[events.length] = e } } } } return events }, get_event_guids: function (elem, types, selector, fn) { var guids = []; var events = TLOC_Delayed.get_events(elem, types, selector, fn); for (var i in events) { e = events[i]; guids[guids.length] = e.guid } return guids }, removeDelay: function (types, selector, fn) { if (typeof types === "object") { for (var type in types) { this.removeDelay(type, selector, types[type]) } return this } return this.each(function () { var events = TLOC_Delayed.get_events(this, types, selector, fn); for (var i in events) { e = events[i]; e.handler = TLOC_Delayed.originals[e.guid] } }) }, stopDelayed: function (types, selector, fn) { if (typeof types === "object") { for (var type in types) { this.stopDelayed(type, selector, types[type]) } return this } return this.each(function () { var guids = TLOC_Delayed.get_event_guids(this, types, selector, fn); for (var i in guids) { clearTimeout(TLOC_Delayed.functions[guids[i]]) } }) }, debounce: function (types, selector, data, fn) { return this.each(function () { $(this).delayed(types, 'debounce', selector, data, fn) }) } }; $.fn.delayed = function (method) { return TLOC_Delayed['delayed'].apply(this, arguments) }; $.fn.delayedOne = function (method) { return TLOC_Delayed['delayedOne'].apply(this, arguments) }; $.fn.delayedFirst = function (method) { return TLOC_Delayed['delayedFirst'].apply(this, arguments) }; $.fn.removeDelay = function (method) { return TLOC_Delayed['removeDelay'].apply(this, arguments) }; $.fn.stopDelayed = function (method) { return TLOC_Delayed['stopDelayed'].apply(this, arguments) }; $.fn.debounce = function (method) { return TLOC_Delayed['debounce'].apply(this, arguments) } })(jQuery);

/*! http://responsiveslides.com v1.32 by @viljamis */
(function (d, D, v) {
	d.fn.responsiveSlides = function (h) {
		var b = d.extend({ auto: !0, speed: 1E3, timeout: 4E3, pager: !1, nav: !1, random: !1, pause: !1, pauseControls: !1, prevText: "Previous", nextText: "Next", maxwidth: "", controls: "", namespace: "rslides", before: function () { }, after: function () { } }, h); return this.each(function () {
			v++; var e = d(this), n, p, i, k, l, m = 0, f = e.children(), w = f.size(), q = parseFloat(b.speed), x = parseFloat(b.timeout), r = parseFloat(b.maxwidth), c = b.namespace, g = c + v, y = c + "_nav " + g + "_nav", s = c + "_here", j = g + "_on", z = g + "_s",
o = d("<ul class='" + c + "_tabs " + g + "_tabs' />"), A = { "float": "left", position: "relative" }, E = { "float": "none", position: "absolute" }, t = function (a) { b.before(); f.stop().fadeOut(q, function () { d(this).removeClass(j).css(E) }).eq(a).fadeIn(q, function () { d(this).addClass(j).css(A); b.after(); m = a }) }; b.random && (f.sort(function () { return Math.round(Math.random()) - 0.5 }), e.empty().append(f)); f.each(function (a) { this.id = z + a }); e.addClass(c + " " + g); h && h.maxwidth && e.css("max-width", r); f.hide().eq(0).addClass(j).css(A).show(); if (1 <
f.size()) {
				if (x < q + 100) return; if (b.pager) { var u = []; f.each(function (a) { a = a + 1; u = u + ("<li><a href='#' class='" + z + a + "'>" + a + "</a></li>") }); o.append(u); l = o.find("a"); h.controls ? d(b.controls).append(o) : e.after(o); n = function (a) { l.closest("li").removeClass(s).eq(a).addClass(s) } } b.auto && (p = function () { k = setInterval(function () { f.stop(true, true); var a = m + 1 < w ? m + 1 : 0; b.pager && n(a); t(a) }, x) }, p()); i = function () { if (b.auto) { clearInterval(k); p() } }; b.pause && e.hover(function () { clearInterval(k) }, function () { i() }); b.pager && (l.bind("click",
function (a) { a.preventDefault(); b.pauseControls || i(); a = l.index(this); if (!(m === a || d("." + j + ":animated").length)) { n(a); t(a) } }).eq(0).closest("li").addClass(s), b.pauseControls && l.hover(function () { clearInterval(k) }, function () { i() })); if (b.nav) {
					c = "<a href='#' class='" + y + " prev'>" + b.prevText + "</a><a href='#' class='" + y + " next'>" + b.nextText + "</a>"; h.controls ? d(b.controls).append(c) : e.after(c); var c = d("." + g + "_nav"), B = d("." + g + "_nav.prev"); c.bind("click", function (a) {
						a.preventDefault(); if (!d("." + j + ":animated").length) {
							var c =
f.index(d("." + j)), a = c - 1, c = c + 1 < w ? m + 1 : 0; t(d(this)[0] === B[0] ? a : c); b.pager && n(d(this)[0] === B[0] ? a : c); b.pauseControls || i()
						} 
					}); b.pauseControls && c.hover(function () { clearInterval(k) }, function () { i() })
				} 
			} if ("undefined" === typeof document.body.style.maxWidth && h.maxwidth) { var C = function () { e.css("width", "100%"); e.width() > r && e.css("width", r) }; C(); d(D).bind("resize", function () { C() }) } 
		})
	} 
})(jQuery, this, 0);

/*
* jPlayer Plugin for jQuery JavaScript Library
* http://www.jplayer.org
*
* Copyright (c) 2009 - 2011 Happyworm Ltd
* Dual licensed under the MIT and GPL licenses.
*  - http://www.opensource.org/licenses/mit-license.php
*  - http://www.gnu.org/copyleft/gpl.html
*
* Author: Mark J Panaghiston
* Version: 2.1.0
* Date: 1st September 2011
*/

(function (b, f) {
	b.fn.jPlayer = function (a) { var c = typeof a === "string", d = Array.prototype.slice.call(arguments, 1), e = this, a = !c && d.length ? b.extend.apply(null, [!0, a].concat(d)) : a; if (c && a.charAt(0) === "_") return e; c ? this.each(function () { var c = b.data(this, "jPlayer"), h = c && b.isFunction(c[a]) ? c[a].apply(c, d) : c; if (h !== c && h !== f) return e = h, !1 }) : this.each(function () { var c = b.data(this, "jPlayer"); c ? c.option(a || {}) : b.data(this, "jPlayer", new b.jPlayer(a, this)) }); return e }; b.jPlayer = function (a, c) {
		if (arguments.length) {
			this.element =
b(c); this.options = b.extend(!0, {}, this.options, a); var d = this; this.element.bind("remove.jPlayer", function () { d.destroy() }); this._init()
		} 
	}; b.jPlayer.emulateMethods = "load play pause"; b.jPlayer.emulateStatus = "src readyState networkState currentTime duration paused ended playbackRate"; b.jPlayer.emulateOptions = "muted volume"; b.jPlayer.reservedEvent = "ready flashreset resize repeat error warning"; b.jPlayer.event = { ready: "jPlayer_ready", flashreset: "jPlayer_flashreset", resize: "jPlayer_resize", repeat: "jPlayer_repeat",
		click: "jPlayer_click", error: "jPlayer_error", warning: "jPlayer_warning", loadstart: "jPlayer_loadstart", progress: "jPlayer_progress", suspend: "jPlayer_suspend", abort: "jPlayer_abort", emptied: "jPlayer_emptied", stalled: "jPlayer_stalled", play: "jPlayer_play", pause: "jPlayer_pause", loadedmetadata: "jPlayer_loadedmetadata", loadeddata: "jPlayer_loadeddata", waiting: "jPlayer_waiting", playing: "jPlayer_playing", canplay: "jPlayer_canplay", canplaythrough: "jPlayer_canplaythrough", seeking: "jPlayer_seeking", seeked: "jPlayer_seeked",
		timeupdate: "jPlayer_timeupdate", ended: "jPlayer_ended", ratechange: "jPlayer_ratechange", durationchange: "jPlayer_durationchange", volumechange: "jPlayer_volumechange"
	}; b.jPlayer.htmlEvent = "loadstart,abort,emptied,stalled,loadedmetadata,loadeddata,canplay,canplaythrough,ratechange".split(","); b.jPlayer.pause = function () { b.each(b.jPlayer.prototype.instances, function (a, b) { b.data("jPlayer").status.srcSet && b.jPlayer("pause") }) }; b.jPlayer.timeFormat = { showHour: !1, showMin: !0, showSec: !0, padHour: !1, padMin: !0, padSec: !0,
		sepHour: ":", sepMin: ":", sepSec: ""
	}; b.jPlayer.convertTime = function (a) { var c = new Date(a * 1E3), d = c.getUTCHours(), a = c.getUTCMinutes(), c = c.getUTCSeconds(), d = b.jPlayer.timeFormat.padHour && d < 10 ? "0" + d : d, a = b.jPlayer.timeFormat.padMin && a < 10 ? "0" + a : a, c = b.jPlayer.timeFormat.padSec && c < 10 ? "0" + c : c; return (b.jPlayer.timeFormat.showHour ? d + b.jPlayer.timeFormat.sepHour : "") + (b.jPlayer.timeFormat.showMin ? a + b.jPlayer.timeFormat.sepMin : "") + (b.jPlayer.timeFormat.showSec ? c + b.jPlayer.timeFormat.sepSec : "") }; b.jPlayer.uaBrowser =
function (a) { var a = a.toLowerCase(), b = /(opera)(?:.*version)?[ \/]([\w.]+)/, d = /(msie) ([\w.]+)/, e = /(mozilla)(?:.*? rv:([\w.]+))?/, a = /(webkit)[ \/]([\w.]+)/.exec(a) || b.exec(a) || d.exec(a) || a.indexOf("compatible") < 0 && e.exec(a) || []; return { browser: a[1] || "", version: a[2] || "0"} }; b.jPlayer.uaPlatform = function (a) {
	var b = a.toLowerCase(), d = /(android)/, e = /(mobile)/, a = /(ipad|iphone|ipod|android|blackberry|playbook|windows ce|webos)/.exec(b) || [], b = /(ipad|playbook)/.exec(b) || !e.exec(b) && d.exec(b) || []; a[1] && (a[1] = a[1].replace(/\s/g,
"_")); return { platform: a[1] || "", tablet: b[1] || ""}
}; b.jPlayer.browser = {}; b.jPlayer.platform = {}; var i = b.jPlayer.uaBrowser(navigator.userAgent); if (i.browser) b.jPlayer.browser[i.browser] = !0, b.jPlayer.browser.version = i.version; i = b.jPlayer.uaPlatform(navigator.userAgent); if (i.platform) b.jPlayer.platform[i.platform] = !0, b.jPlayer.platform.mobile = !i.tablet, b.jPlayer.platform.tablet = !!i.tablet; b.jPlayer.prototype = { count: 0, version: { script: "2.1.0", needFlash: "2.1.0", flash: "unknown" }, options: { swfPath: "js", solution: "html, flash",
	supplied: "mp3", preload: "metadata", volume: 0.8, muted: !1, wmode: "opaque", backgroundColor: "#000000", cssSelectorAncestor: "#jp_container_1", cssSelector: { videoPlay: ".jp-video-play", play: ".jp-play", pause: ".jp-pause", stop: ".jp-stop", seekBar: ".jp-seek-bar", playBar: ".jp-play-bar", mute: ".jp-mute", unmute: ".jp-unmute", volumeBar: ".jp-volume-bar", volumeBarValue: ".jp-volume-bar-value", volumeMax: ".jp-volume-max", currentTime: ".jp-current-time", duration: ".jp-duration", fullScreen: ".jp-full-screen", restoreScreen: ".jp-restore-screen",
		repeat: ".jp-repeat", repeatOff: ".jp-repeat-off", gui: ".jp-gui", noSolution: ".jp-no-solution"
	}, fullScreen: !1, autohide: { restored: !1, full: !0, fadeIn: 200, fadeOut: 600, hold: 1E3 }, loop: !1, repeat: function (a) { a.jPlayer.options.loop ? b(this).unbind(".jPlayerRepeat").bind(b.jPlayer.event.ended + ".jPlayer.jPlayerRepeat", function () { b(this).jPlayer("play") }) : b(this).unbind(".jPlayerRepeat") }, nativeVideoControls: {}, noFullScreen: { msie: /msie [0-6]/, ipad: /ipad.*?os [0-4]/, iphone: /iphone/, ipod: /ipod/, android_pad: /android [0-3](?!.*?mobile)/,
		android_phone: /android.*?mobile/, blackberry: /blackberry/, windows_ce: /windows ce/, webos: /webos/
	}, noVolume: { ipad: /ipad/, iphone: /iphone/, ipod: /ipod/, android_pad: /android(?!.*?mobile)/, android_phone: /android.*?mobile/, blackberry: /blackberry/, windows_ce: /windows ce/, webos: /webos/, playbook: /playbook/ }, verticalVolume: !1, idPrefix: "jp", noConflict: "jQuery", emulateHtml: !1, errorAlerts: !1, warningAlerts: !1
}, optionsAudio: { size: { width: "0px", height: "0px", cssClass: "" }, sizeFull: { width: "0px", height: "0px", cssClass: ""} },
	optionsVideo: { size: { width: "480px", height: "270px", cssClass: "jp-video-270p" }, sizeFull: { width: "100%", height: "100%", cssClass: "jp-video-full"} }, instances: {}, status: { src: "", media: {}, paused: !0, format: {}, formatType: "", waitForPlay: !0, waitForLoad: !0, srcSet: !1, video: !1, seekPercent: 0, currentPercentRelative: 0, currentPercentAbsolute: 0, currentTime: 0, duration: 0, readyState: 0, networkState: 0, playbackRate: 1, ended: 0 }, internal: { ready: !1 }, solution: { html: !0, flash: !0 }, format: { mp3: { codec: 'audio/mpeg; codecs="mp3"', flashCanPlay: !0,
		media: "audio"
	}, m4a: { codec: 'audio/mp4; codecs="mp4a.40.2"', flashCanPlay: !0, media: "audio" }, oga: { codec: 'audio/ogg; codecs="vorbis"', flashCanPlay: !1, media: "audio" }, wav: { codec: 'audio/wav; codecs="1"', flashCanPlay: !1, media: "audio" }, webma: { codec: 'audio/webm; codecs="vorbis"', flashCanPlay: !1, media: "audio" }, fla: { codec: "audio/x-flv", flashCanPlay: !0, media: "audio" }, m4v: { codec: 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"', flashCanPlay: !0, media: "video" }, ogv: { codec: 'video/ogg; codecs="theora, vorbis"', flashCanPlay: !1,
		media: "video"
	}, webmv: { codec: 'video/webm; codecs="vorbis, vp8"', flashCanPlay: !1, media: "video" }, flv: { codec: "video/x-flv", flashCanPlay: !0, media: "video"}
	}, _init: function () {
		var a = this; this.element.empty(); this.status = b.extend({}, this.status); this.internal = b.extend({}, this.internal); this.internal.domNode = this.element.get(0); this.formats = []; this.solutions = []; this.require = {}; this.htmlElement = {}; this.html = {}; this.html.audio = {}; this.html.video = {}; this.flash = {}; this.css = {}; this.css.cs = {}; this.css.jq = {}; this.ancestorJq =
[]; this.options.volume = this._limitValue(this.options.volume, 0, 1); b.each(this.options.supplied.toLowerCase().split(","), function (c, d) { var e = d.replace(/^\s+|\s+$/g, ""); if (a.format[e]) { var f = !1; b.each(a.formats, function (a, b) { if (e === b) return f = !0, !1 }); f || a.formats.push(e) } }); b.each(this.options.solution.toLowerCase().split(","), function (c, d) { var e = d.replace(/^\s+|\s+$/g, ""); if (a.solution[e]) { var f = !1; b.each(a.solutions, function (a, b) { if (e === b) return f = !0, !1 }); f || a.solutions.push(e) } }); this.internal.instance =
"jp_" + this.count; this.instances[this.internal.instance] = this.element; this.element.attr("id") || this.element.attr("id", this.options.idPrefix + "_jplayer_" + this.count); this.internal.self = b.extend({}, { id: this.element.attr("id"), jq: this.element }); this.internal.audio = b.extend({}, { id: this.options.idPrefix + "_audio_" + this.count, jq: f }); this.internal.video = b.extend({}, { id: this.options.idPrefix + "_video_" + this.count, jq: f }); this.internal.flash = b.extend({}, { id: this.options.idPrefix + "_flash_" + this.count, jq: f, swf: this.options.swfPath +
(this.options.swfPath.toLowerCase().slice(-4) !== ".swf" ? (this.options.swfPath && this.options.swfPath.slice(-1) !== "/" ? "/" : "") + "Jplayer.swf" : "")
}); this.internal.poster = b.extend({}, { id: this.options.idPrefix + "_poster_" + this.count, jq: f }); b.each(b.jPlayer.event, function (b, c) { a.options[b] !== f && (a.element.bind(c + ".jPlayer", a.options[b]), a.options[b] = f) }); this.require.audio = !1; this.require.video = !1; b.each(this.formats, function (b, c) { a.require[a.format[c].media] = !0 }); this.options = this.require.video ? b.extend(!0,
{}, this.optionsVideo, this.options) : b.extend(!0, {}, this.optionsAudio, this.options); this._setSize(); this.status.nativeVideoControls = this._uaBlocklist(this.options.nativeVideoControls); this.status.noFullScreen = this._uaBlocklist(this.options.noFullScreen); this.status.noVolume = this._uaBlocklist(this.options.noVolume); this._restrictNativeVideoControls(); this.htmlElement.poster = document.createElement("img"); this.htmlElement.poster.id = this.internal.poster.id; this.htmlElement.poster.onload = function () {
	(!a.status.video ||
a.status.waitForPlay) && a.internal.poster.jq.show()
}; this.element.append(this.htmlElement.poster); this.internal.poster.jq = b("#" + this.internal.poster.id); this.internal.poster.jq.css({ width: this.status.width, height: this.status.height }); this.internal.poster.jq.hide(); this.internal.poster.jq.bind("click.jPlayer", function () { a._trigger(b.jPlayer.event.click) }); this.html.audio.available = !1; if (this.require.audio) this.htmlElement.audio = document.createElement("audio"), this.htmlElement.audio.id = this.internal.audio.id,
this.html.audio.available = !!this.htmlElement.audio.canPlayType && this._testCanPlayType(this.htmlElement.audio); this.html.video.available = !1; if (this.require.video) this.htmlElement.video = document.createElement("video"), this.htmlElement.video.id = this.internal.video.id, this.html.video.available = !!this.htmlElement.video.canPlayType && this._testCanPlayType(this.htmlElement.video); this.flash.available = this._checkForFlash(10); this.html.canPlay = {}; this.flash.canPlay = {}; b.each(this.formats, function (b, c) {
	a.html.canPlay[c] =
a.html[a.format[c].media].available && "" !== a.htmlElement[a.format[c].media].canPlayType(a.format[c].codec); a.flash.canPlay[c] = a.format[c].flashCanPlay && a.flash.available
}); this.html.desired = !1; this.flash.desired = !1; b.each(this.solutions, function (c, d) { if (c === 0) a[d].desired = !0; else { var e = !1, f = !1; b.each(a.formats, function (b, c) { a[a.solutions[0]].canPlay[c] && (a.format[c].media === "video" ? f = !0 : e = !0) }); a[d].desired = a.require.audio && !e || a.require.video && !f } }); this.html.support = {}; this.flash.support = {}; b.each(this.formats,
function (b, c) { a.html.support[c] = a.html.canPlay[c] && a.html.desired; a.flash.support[c] = a.flash.canPlay[c] && a.flash.desired }); this.html.used = !1; this.flash.used = !1; b.each(this.solutions, function (c, d) { b.each(a.formats, function (b, c) { if (a[d].support[c]) return a[d].used = !0, !1 }) }); this._resetActive(); this._resetGate(); this._cssSelectorAncestor(this.options.cssSelectorAncestor); !this.html.used && !this.flash.used ? (this._error({ type: b.jPlayer.error.NO_SOLUTION, context: "{solution:'" + this.options.solution + "', supplied:'" +
this.options.supplied + "'}", message: b.jPlayer.errorMsg.NO_SOLUTION, hint: b.jPlayer.errorHint.NO_SOLUTION
}), this.css.jq.noSolution.length && this.css.jq.noSolution.show()) : this.css.jq.noSolution.length && this.css.jq.noSolution.hide(); if (this.flash.used) {
			var c, d = "jQuery=" + encodeURI(this.options.noConflict) + "&id=" + encodeURI(this.internal.self.id) + "&vol=" + this.options.volume + "&muted=" + this.options.muted; if (b.browser.msie && Number(b.browser.version) <= 8) {
				d = ['<param name="movie" value="' + this.internal.flash.swf +
'" />', '<param name="FlashVars" value="' + d + '" />', '<param name="allowScriptAccess" value="always" />', '<param name="bgcolor" value="' + this.options.backgroundColor + '" />', '<param name="wmode" value="' + this.options.wmode + '" />']; c = document.createElement('<object id="' + this.internal.flash.id + '" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" width="0" height="0"></object>'); for (var e = 0; e < d.length; e++) c.appendChild(document.createElement(d[e]))
			} else e = function (a, b, c) {
				var d = document.createElement("param");
				d.setAttribute("name", b); d.setAttribute("value", c); a.appendChild(d)
			}, c = document.createElement("object"), c.setAttribute("id", this.internal.flash.id), c.setAttribute("data", this.internal.flash.swf), c.setAttribute("type", "application/x-shockwave-flash"), c.setAttribute("width", "1"), c.setAttribute("height", "1"), e(c, "flashvars", d), e(c, "allowscriptaccess", "always"), e(c, "bgcolor", this.options.backgroundColor), e(c, "wmode", this.options.wmode); this.element.append(c); this.internal.flash.jq = b(c)
		} if (this.html.used) {
			if (this.html.audio.available) this._addHtmlEventListeners(this.htmlElement.audio,
this.html.audio), this.element.append(this.htmlElement.audio), this.internal.audio.jq = b("#" + this.internal.audio.id); if (this.html.video.available) this._addHtmlEventListeners(this.htmlElement.video, this.html.video), this.element.append(this.htmlElement.video), this.internal.video.jq = b("#" + this.internal.video.id), this.status.nativeVideoControls ? this.internal.video.jq.css({ width: this.status.width, height: this.status.height }) : this.internal.video.jq.css({ width: "0px", height: "0px" }), this.internal.video.jq.bind("click.jPlayer",
function () { a._trigger(b.jPlayer.event.click) })
		} this.options.emulateHtml && this._emulateHtmlBridge(); this.html.used && !this.flash.used && setTimeout(function () { a.internal.ready = !0; a.version.flash = "n/a"; a._trigger(b.jPlayer.event.repeat); a._trigger(b.jPlayer.event.ready) }, 100); this._updateNativeVideoControls(); this._updateInterface(); this._updateButtons(!1); this._updateAutohide(); this._updateVolume(this.options.volume); this._updateMute(this.options.muted); this.css.jq.videoPlay.length && this.css.jq.videoPlay.hide();
		b.jPlayer.prototype.count++
	}, destroy: function () {
		this.clearMedia(); this._removeUiClass(); this.css.jq.currentTime.length && this.css.jq.currentTime.text(""); this.css.jq.duration.length && this.css.jq.duration.text(""); b.each(this.css.jq, function (a, b) { b.length && b.unbind(".jPlayer") }); this.internal.poster.jq.unbind(".jPlayer"); this.internal.video.jq && this.internal.video.jq.unbind(".jPlayer"); this.options.emulateHtml && this._destroyHtmlBridge(); this.element.removeData("jPlayer"); this.element.unbind(".jPlayer");
		this.element.empty(); delete this.instances[this.internal.instance]
	}, enable: function () { }, disable: function () { }, _testCanPlayType: function (a) { try { return a.canPlayType(this.format.mp3.codec), !0 } catch (b) { return !1 } }, _uaBlocklist: function (a) { var c = navigator.userAgent.toLowerCase(), d = !1; b.each(a, function (a, b) { if (b && b.test(c)) return d = !0, !1 }); return d }, _restrictNativeVideoControls: function () { if (this.require.audio && this.status.nativeVideoControls) this.status.nativeVideoControls = !1, this.status.noFullScreen = !0 },
	_updateNativeVideoControls: function () { if (this.html.video.available && this.html.used) this.htmlElement.video.controls = this.status.nativeVideoControls, this._updateAutohide(), this.status.nativeVideoControls && this.require.video ? (this.internal.poster.jq.hide(), this.internal.video.jq.css({ width: this.status.width, height: this.status.height })) : this.status.waitForPlay && this.status.video && (this.internal.poster.jq.show(), this.internal.video.jq.css({ width: "0px", height: "0px" })) }, _addHtmlEventListeners: function (a,
c) {
		var d = this; a.preload = this.options.preload; a.muted = this.options.muted; a.volume = this.options.volume; a.addEventListener("progress", function () { c.gate && (d._getHtmlStatus(a), d._updateInterface(), d._trigger(b.jPlayer.event.progress)) }, !1); a.addEventListener("timeupdate", function () { c.gate && (d._getHtmlStatus(a), d._updateInterface(), d._trigger(b.jPlayer.event.timeupdate)) }, !1); a.addEventListener("durationchange", function () {
			if (c.gate) d.status.duration = this.duration, d._getHtmlStatus(a), d._updateInterface(),
d._trigger(b.jPlayer.event.durationchange)
		}, !1); a.addEventListener("play", function () { c.gate && (d._updateButtons(!0), d._html_checkWaitForPlay(), d._trigger(b.jPlayer.event.play)) }, !1); a.addEventListener("playing", function () { c.gate && (d._updateButtons(!0), d._seeked(), d._trigger(b.jPlayer.event.playing)) }, !1); a.addEventListener("pause", function () { c.gate && (d._updateButtons(!1), d._trigger(b.jPlayer.event.pause)) }, !1); a.addEventListener("waiting", function () { c.gate && (d._seeking(), d._trigger(b.jPlayer.event.waiting)) },
!1); a.addEventListener("seeking", function () { c.gate && (d._seeking(), d._trigger(b.jPlayer.event.seeking)) }, !1); a.addEventListener("seeked", function () { c.gate && (d._seeked(), d._trigger(b.jPlayer.event.seeked)) }, !1); a.addEventListener("volumechange", function () { if (c.gate) d.options.volume = a.volume, d.options.muted = a.muted, d._updateMute(), d._updateVolume(), d._trigger(b.jPlayer.event.volumechange) }, !1); a.addEventListener("suspend", function () { c.gate && (d._seeked(), d._trigger(b.jPlayer.event.suspend)) }, !1); a.addEventListener("ended",
function () { if (c.gate) { if (!b.jPlayer.browser.webkit) d.htmlElement.media.currentTime = 0; d.htmlElement.media.pause(); d._updateButtons(!1); d._getHtmlStatus(a, !0); d._updateInterface(); d._trigger(b.jPlayer.event.ended) } }, !1); a.addEventListener("error", function () {
	if (c.gate && (d._updateButtons(!1), d._seeked(), d.status.srcSet)) clearTimeout(d.internal.htmlDlyCmdId), d.status.waitForLoad = !0, d.status.waitForPlay = !0, d.status.video && !d.status.nativeVideoControls && d.internal.video.jq.css({ width: "0px", height: "0px" }),
d._validString(d.status.media.poster) && !d.status.nativeVideoControls && d.internal.poster.jq.show(), d.css.jq.videoPlay.length && d.css.jq.videoPlay.show(), d._error({ type: b.jPlayer.error.URL, context: d.status.src, message: b.jPlayer.errorMsg.URL, hint: b.jPlayer.errorHint.URL })
}, !1); b.each(b.jPlayer.htmlEvent, function (e, g) { a.addEventListener(this, function () { c.gate && d._trigger(b.jPlayer.event[g]) }, !1) })
	}, _getHtmlStatus: function (a, b) {
		var d = 0, e = 0, g = 0, f = 0; if (a.duration) this.status.duration = a.duration; d = a.currentTime;
		e = this.status.duration > 0 ? 100 * d / this.status.duration : 0; typeof a.seekable === "object" && a.seekable.length > 0 ? (g = this.status.duration > 0 ? 100 * a.seekable.end(a.seekable.length - 1) / this.status.duration : 100, f = 100 * a.currentTime / a.seekable.end(a.seekable.length - 1)) : (g = 100, f = e); b && (e = f = d = 0); this.status.seekPercent = g; this.status.currentPercentRelative = f; this.status.currentPercentAbsolute = e; this.status.currentTime = d; this.status.readyState = a.readyState; this.status.networkState = a.networkState; this.status.playbackRate =
a.playbackRate; this.status.ended = a.ended
	}, _resetStatus: function () { this.status = b.extend({}, this.status, b.jPlayer.prototype.status) }, _trigger: function (a, c, d) { a = b.Event(a); a.jPlayer = {}; a.jPlayer.version = b.extend({}, this.version); a.jPlayer.options = b.extend(!0, {}, this.options); a.jPlayer.status = b.extend(!0, {}, this.status); a.jPlayer.html = b.extend(!0, {}, this.html); a.jPlayer.flash = b.extend(!0, {}, this.flash); if (c) a.jPlayer.error = b.extend({}, c); if (d) a.jPlayer.warning = b.extend({}, d); this.element.trigger(a) },
	jPlayerFlashEvent: function (a, c) {
		if (a === b.jPlayer.event.ready) if (this.internal.ready) { if (this.flash.gate) { if (this.status.srcSet) { var d = this.status.currentTime, e = this.status.paused; this.setMedia(this.status.media); d > 0 && (e ? this.pause(d) : this.play(d)) } this._trigger(b.jPlayer.event.flashreset) } } else this.internal.ready = !0, this.internal.flash.jq.css({ width: "0px", height: "0px" }), this.version.flash = c.version, this.version.needFlash !== this.version.flash && this._error({ type: b.jPlayer.error.VERSION, context: this.version.flash,
			message: b.jPlayer.errorMsg.VERSION + this.version.flash, hint: b.jPlayer.errorHint.VERSION
		}), this._trigger(b.jPlayer.event.repeat), this._trigger(a); if (this.flash.gate) switch (a) {
			case b.jPlayer.event.progress: this._getFlashStatus(c); this._updateInterface(); this._trigger(a); break; case b.jPlayer.event.timeupdate: this._getFlashStatus(c); this._updateInterface(); this._trigger(a); break; case b.jPlayer.event.play: this._seeked(); this._updateButtons(!0); this._trigger(a); break; case b.jPlayer.event.pause: this._updateButtons(!1);
				this._trigger(a); break; case b.jPlayer.event.ended: this._updateButtons(!1); this._trigger(a); break; case b.jPlayer.event.click: this._trigger(a); break; case b.jPlayer.event.error: this.status.waitForLoad = !0; this.status.waitForPlay = !0; this.status.video && this.internal.flash.jq.css({ width: "0px", height: "0px" }); this._validString(this.status.media.poster) && this.internal.poster.jq.show(); this.css.jq.videoPlay.length && this.status.video && this.css.jq.videoPlay.show(); this.status.video ? this._flash_setVideo(this.status.media) :
this._flash_setAudio(this.status.media); this._updateButtons(!1); this._error({ type: b.jPlayer.error.URL, context: c.src, message: b.jPlayer.errorMsg.URL, hint: b.jPlayer.errorHint.URL }); break; case b.jPlayer.event.seeking: this._seeking(); this._trigger(a); break; case b.jPlayer.event.seeked: this._seeked(); this._trigger(a); break; case b.jPlayer.event.ready: break; default: this._trigger(a)
		} return !1
	}, _getFlashStatus: function (a) {
		this.status.seekPercent = a.seekPercent; this.status.currentPercentRelative = a.currentPercentRelative;
		this.status.currentPercentAbsolute = a.currentPercentAbsolute; this.status.currentTime = a.currentTime; this.status.duration = a.duration; this.status.readyState = 4; this.status.networkState = 0; this.status.playbackRate = 1; this.status.ended = !1
	}, _updateButtons: function (a) {
		if (a !== f) this.status.paused = !a, this.css.jq.play.length && this.css.jq.pause.length && (a ? (this.css.jq.play.hide(), this.css.jq.pause.show()) : (this.css.jq.play.show(), this.css.jq.pause.hide())); this.css.jq.restoreScreen.length && this.css.jq.fullScreen.length &&
(this.status.noFullScreen ? (this.css.jq.fullScreen.hide(), this.css.jq.restoreScreen.hide()) : this.options.fullScreen ? (this.css.jq.fullScreen.hide(), this.css.jq.restoreScreen.show()) : (this.css.jq.fullScreen.show(), this.css.jq.restoreScreen.hide())); this.css.jq.repeat.length && this.css.jq.repeatOff.length && (this.options.loop ? (this.css.jq.repeat.hide(), this.css.jq.repeatOff.show()) : (this.css.jq.repeat.show(), this.css.jq.repeatOff.hide()))
	}, _updateInterface: function () {
		this.css.jq.seekBar.length && this.css.jq.seekBar.width(this.status.seekPercent +
"%"); this.css.jq.playBar.length && this.css.jq.playBar.width(this.status.currentPercentRelative + "%"); this.css.jq.currentTime.length && this.css.jq.currentTime.text(b.jPlayer.convertTime(this.status.currentTime)); this.css.jq.duration.length && this.css.jq.duration.text(b.jPlayer.convertTime(this.status.duration))
	}, _seeking: function () { this.css.jq.seekBar.length && this.css.jq.seekBar.addClass("jp-seeking-bg") }, _seeked: function () { this.css.jq.seekBar.length && this.css.jq.seekBar.removeClass("jp-seeking-bg") },
	_resetGate: function () { this.html.audio.gate = !1; this.html.video.gate = !1; this.flash.gate = !1 }, _resetActive: function () { this.html.active = !1; this.flash.active = !1 }, setMedia: function (a) {
		var c = this, d = !1, e = this.status.media.poster !== a.poster; this._resetMedia(); this._resetGate(); this._resetActive(); b.each(this.formats, function (e, f) {
			var i = c.format[f].media === "video"; b.each(c.solutions, function (b, e) {
				if (c[e].support[f] && c._validString(a[f])) {
					var g = e === "html"; i ? (g ? (c.html.video.gate = !0, c._html_setVideo(a), c.html.active =
!0) : (c.flash.gate = !0, c._flash_setVideo(a), c.flash.active = !0), c.css.jq.videoPlay.length && c.css.jq.videoPlay.show(), c.status.video = !0) : (g ? (c.html.audio.gate = !0, c._html_setAudio(a), c.html.active = !0) : (c.flash.gate = !0, c._flash_setAudio(a), c.flash.active = !0), c.css.jq.videoPlay.length && c.css.jq.videoPlay.hide(), c.status.video = !1); d = !0; return !1
				} 
			}); if (d) return !1
		}); if (d) {
			if ((!this.status.nativeVideoControls || !this.html.video.gate) && this._validString(a.poster)) e ? this.htmlElement.poster.src = a.poster : this.internal.poster.jq.show();
			this.status.srcSet = !0; this.status.media = b.extend({}, a); this._updateButtons(!1); this._updateInterface()
		} else this._error({ type: b.jPlayer.error.NO_SUPPORT, context: "{supplied:'" + this.options.supplied + "'}", message: b.jPlayer.errorMsg.NO_SUPPORT, hint: b.jPlayer.errorHint.NO_SUPPORT })
	}, _resetMedia: function () {
		this._resetStatus(); this._updateButtons(!1); this._updateInterface(); this._seeked(); this.internal.poster.jq.hide(); clearTimeout(this.internal.htmlDlyCmdId); this.html.active ? this._html_resetMedia() : this.flash.active &&
this._flash_resetMedia()
	}, clearMedia: function () { this._resetMedia(); this.html.active ? this._html_clearMedia() : this.flash.active && this._flash_clearMedia(); this._resetGate(); this._resetActive() }, load: function () { this.status.srcSet ? this.html.active ? this._html_load() : this.flash.active && this._flash_load() : this._urlNotSetError("load") }, play: function (a) { a = typeof a === "number" ? a : NaN; this.status.srcSet ? this.html.active ? this._html_play(a) : this.flash.active && this._flash_play(a) : this._urlNotSetError("play") }, videoPlay: function () { this.play() },
	pause: function (a) { a = typeof a === "number" ? a : NaN; this.status.srcSet ? this.html.active ? this._html_pause(a) : this.flash.active && this._flash_pause(a) : this._urlNotSetError("pause") }, pauseOthers: function () { var a = this; b.each(this.instances, function (b, d) { a.element !== d && d.data("jPlayer").status.srcSet && d.jPlayer("pause") }) }, stop: function () { this.status.srcSet ? this.html.active ? this._html_pause(0) : this.flash.active && this._flash_pause(0) : this._urlNotSetError("stop") }, playHead: function (a) {
		a = this._limitValue(a, 0, 100);
		this.status.srcSet ? this.html.active ? this._html_playHead(a) : this.flash.active && this._flash_playHead(a) : this._urlNotSetError("playHead")
	}, _muted: function (a) { this.options.muted = a; this.html.used && this._html_mute(a); this.flash.used && this._flash_mute(a); !this.html.video.gate && !this.html.audio.gate && (this._updateMute(a), this._updateVolume(this.options.volume), this._trigger(b.jPlayer.event.volumechange)) }, mute: function (a) { a = a === f ? !0 : !!a; this._muted(a) }, unmute: function (a) { a = a === f ? !0 : !!a; this._muted(!a) }, _updateMute: function (a) {
		if (a ===
f) a = this.options.muted; this.css.jq.mute.length && this.css.jq.unmute.length && (this.status.noVolume ? (this.css.jq.mute.hide(), this.css.jq.unmute.hide()) : a ? (this.css.jq.mute.hide(), this.css.jq.unmute.show()) : (this.css.jq.mute.show(), this.css.jq.unmute.hide()))
	}, volume: function (a) { a = this._limitValue(a, 0, 1); this.options.volume = a; this.html.used && this._html_volume(a); this.flash.used && this._flash_volume(a); !this.html.video.gate && !this.html.audio.gate && (this._updateVolume(a), this._trigger(b.jPlayer.event.volumechange)) },
	volumeBar: function (a) { if (this.css.jq.volumeBar.length) { var b = this.css.jq.volumeBar.offset(), d = a.pageX - b.left, e = this.css.jq.volumeBar.width(), a = this.css.jq.volumeBar.height() - a.pageY + b.top, b = this.css.jq.volumeBar.height(); this.options.verticalVolume ? this.volume(a / b) : this.volume(d / e) } this.options.muted && this._muted(!1) }, volumeBarValue: function (a) { this.volumeBar(a) }, _updateVolume: function (a) {
		if (a === f) a = this.options.volume; a = this.options.muted ? 0 : a; this.status.noVolume ? (this.css.jq.volumeBar.length && this.css.jq.volumeBar.hide(),
this.css.jq.volumeBarValue.length && this.css.jq.volumeBarValue.hide(), this.css.jq.volumeMax.length && this.css.jq.volumeMax.hide()) : (this.css.jq.volumeBar.length && this.css.jq.volumeBar.show(), this.css.jq.volumeBarValue.length && (this.css.jq.volumeBarValue.show(), this.css.jq.volumeBarValue[this.options.verticalVolume ? "height" : "width"](a * 100 + "%")), this.css.jq.volumeMax.length && this.css.jq.volumeMax.show())
	}, volumeMax: function () { this.volume(1); this.options.muted && this._muted(!1) }, _cssSelectorAncestor: function (a) {
		var c =
this; this.options.cssSelectorAncestor = a; this._removeUiClass(); this.ancestorJq = a ? b(a) : []; a && this.ancestorJq.length !== 1 && this._warning({ type: b.jPlayer.warning.CSS_SELECTOR_COUNT, context: a, message: b.jPlayer.warningMsg.CSS_SELECTOR_COUNT + this.ancestorJq.length + " found for cssSelectorAncestor.", hint: b.jPlayer.warningHint.CSS_SELECTOR_COUNT }); this._addUiClass(); b.each(this.options.cssSelector, function (a, b) { c._cssSelector(a, b) })
	}, _cssSelector: function (a, c) {
		var d = this; typeof c === "string" ? b.jPlayer.prototype.options.cssSelector[a] ?
(this.css.jq[a] && this.css.jq[a].length && this.css.jq[a].unbind(".jPlayer"), this.options.cssSelector[a] = c, this.css.cs[a] = this.options.cssSelectorAncestor + " " + c, this.css.jq[a] = c ? b(this.css.cs[a]) : [], this.css.jq[a].length && this.css.jq[a].bind("click.jPlayer", function (c) { d[a](c); b(this).blur(); return !1 }), c && this.css.jq[a].length !== 1 && this._warning({ type: b.jPlayer.warning.CSS_SELECTOR_COUNT, context: this.css.cs[a], message: b.jPlayer.warningMsg.CSS_SELECTOR_COUNT + this.css.jq[a].length + " found for " + a + " method.",
	hint: b.jPlayer.warningHint.CSS_SELECTOR_COUNT
})) : this._warning({ type: b.jPlayer.warning.CSS_SELECTOR_METHOD, context: a, message: b.jPlayer.warningMsg.CSS_SELECTOR_METHOD, hint: b.jPlayer.warningHint.CSS_SELECTOR_METHOD }) : this._warning({ type: b.jPlayer.warning.CSS_SELECTOR_STRING, context: c, message: b.jPlayer.warningMsg.CSS_SELECTOR_STRING, hint: b.jPlayer.warningHint.CSS_SELECTOR_STRING })
	}, seekBar: function (a) {
		if (this.css.jq.seekBar) {
			var b = this.css.jq.seekBar.offset(), a = a.pageX - b.left, b = this.css.jq.seekBar.width();
			this.playHead(100 * a / b)
		} 
	}, playBar: function (a) { this.seekBar(a) }, repeat: function () { this._loop(!0) }, repeatOff: function () { this._loop(!1) }, _loop: function (a) { if (this.options.loop !== a) this.options.loop = a, this._updateButtons(), this._trigger(b.jPlayer.event.repeat) }, currentTime: function () { }, duration: function () { }, gui: function () { }, noSolution: function () { }, option: function (a, c) {
		var d = a; if (arguments.length === 0) return b.extend(!0, {}, this.options); if (typeof a === "string") {
			var e = a.split("."); if (c === f) {
				for (var d = b.extend(!0,
{}, this.options), g = 0; g < e.length; g++) if (d[e[g]] !== f) d = d[e[g]]; else return this._warning({ type: b.jPlayer.warning.OPTION_KEY, context: a, message: b.jPlayer.warningMsg.OPTION_KEY, hint: b.jPlayer.warningHint.OPTION_KEY }), f; return d
			} for (var g = d = {}, h = 0; h < e.length; h++) h < e.length - 1 ? (g[e[h]] = {}, g = g[e[h]]) : g[e[h]] = c
		} this._setOptions(d); return this
	}, _setOptions: function (a) { var c = this; b.each(a, function (a, b) { c._setOption(a, b) }); return this }, _setOption: function (a, c) {
		var d = this; switch (a) {
			case "volume": this.volume(c);
				break; case "muted": this._muted(c); break; case "cssSelectorAncestor": this._cssSelectorAncestor(c); break; case "cssSelector": b.each(c, function (a, b) { d._cssSelector(a, b) }); break; case "fullScreen": this.options[a] !== c && (this._removeUiClass(), this.options[a] = c, this._refreshSize()); break; case "size": !this.options.fullScreen && this.options[a].cssClass !== c.cssClass && this._removeUiClass(); this.options[a] = b.extend({}, this.options[a], c); this._refreshSize(); break; case "sizeFull": this.options.fullScreen && this.options[a].cssClass !==
c.cssClass && this._removeUiClass(); this.options[a] = b.extend({}, this.options[a], c); this._refreshSize(); break; case "autohide": this.options[a] = b.extend({}, this.options[a], c); this._updateAutohide(); break; case "loop": this._loop(c); break; case "nativeVideoControls": this.options[a] = b.extend({}, this.options[a], c); this.status.nativeVideoControls = this._uaBlocklist(this.options.nativeVideoControls); this._restrictNativeVideoControls(); this._updateNativeVideoControls(); break; case "noFullScreen": this.options[a] =
b.extend({}, this.options[a], c); this.status.nativeVideoControls = this._uaBlocklist(this.options.nativeVideoControls); this.status.noFullScreen = this._uaBlocklist(this.options.noFullScreen); this._restrictNativeVideoControls(); this._updateButtons(); break; case "noVolume": this.options[a] = b.extend({}, this.options[a], c); this.status.noVolume = this._uaBlocklist(this.options.noVolume); this._updateVolume(); this._updateMute(); break; case "emulateHtml": this.options[a] !== c && ((this.options[a] = c) ? this._emulateHtmlBridge() :
this._destroyHtmlBridge())
		} return this
	}, _refreshSize: function () { this._setSize(); this._addUiClass(); this._updateSize(); this._updateButtons(); this._updateAutohide(); this._trigger(b.jPlayer.event.resize) }, _setSize: function () {
		this.options.fullScreen ? (this.status.width = this.options.sizeFull.width, this.status.height = this.options.sizeFull.height, this.status.cssClass = this.options.sizeFull.cssClass) : (this.status.width = this.options.size.width, this.status.height = this.options.size.height, this.status.cssClass =
this.options.size.cssClass); this.element.css({ width: this.status.width, height: this.status.height })
	}, _addUiClass: function () { this.ancestorJq.length && this.ancestorJq.addClass(this.status.cssClass) }, _removeUiClass: function () { this.ancestorJq.length && this.ancestorJq.removeClass(this.status.cssClass) }, _updateSize: function () {
		this.internal.poster.jq.css({ width: this.status.width, height: this.status.height }); !this.status.waitForPlay && this.html.active && this.status.video || this.html.video.available && this.html.used &&
this.status.nativeVideoControls ? this.internal.video.jq.css({ width: this.status.width, height: this.status.height }) : !this.status.waitForPlay && this.flash.active && this.status.video && this.internal.flash.jq.css({ width: this.status.width, height: this.status.height })
	}, _updateAutohide: function () {
		var a = this, b = function () { a.css.jq.gui.fadeIn(a.options.autohide.fadeIn, function () { clearTimeout(a.internal.autohideId); a.internal.autohideId = setTimeout(function () { a.css.jq.gui.fadeOut(a.options.autohide.fadeOut) }, a.options.autohide.hold) }) };
		this.css.jq.gui.length && (this.css.jq.gui.stop(!0, !0), clearTimeout(this.internal.autohideId), this.element.unbind(".jPlayerAutohide"), this.css.jq.gui.unbind(".jPlayerAutohide"), this.status.nativeVideoControls ? this.css.jq.gui.hide() : this.options.fullScreen && this.options.autohide.full || !this.options.fullScreen && this.options.autohide.restored ? (this.element.bind("mousemove.jPlayer.jPlayerAutohide", b), this.css.jq.gui.bind("mousemove.jPlayer.jPlayerAutohide", b), this.css.jq.gui.hide()) : this.css.jq.gui.show())
	},
	fullScreen: function () { this._setOption("fullScreen", !0) }, restoreScreen: function () { this._setOption("fullScreen", !1) }, _html_initMedia: function () { this.htmlElement.media.src = this.status.src; this.options.preload !== "none" && this._html_load(); this._trigger(b.jPlayer.event.timeupdate) }, _html_setAudio: function (a) { var c = this; b.each(this.formats, function (b, e) { if (c.html.support[e] && a[e]) return c.status.src = a[e], c.status.format[e] = !0, c.status.formatType = e, !1 }); this.htmlElement.media = this.htmlElement.audio; this._html_initMedia() },
	_html_setVideo: function (a) { var c = this; b.each(this.formats, function (b, e) { if (c.html.support[e] && a[e]) return c.status.src = a[e], c.status.format[e] = !0, c.status.formatType = e, !1 }); if (this.status.nativeVideoControls) this.htmlElement.video.poster = this._validString(a.poster) ? a.poster : ""; this.htmlElement.media = this.htmlElement.video; this._html_initMedia() }, _html_resetMedia: function () {
		this.htmlElement.media && (this.htmlElement.media.id === this.internal.video.id && !this.status.nativeVideoControls && this.internal.video.jq.css({ width: "0px",
			height: "0px"
		}), this.htmlElement.media.pause())
	}, _html_clearMedia: function () { if (this.htmlElement.media) this.htmlElement.media.src = "", this.htmlElement.media.load() }, _html_load: function () { if (this.status.waitForLoad) this.status.waitForLoad = !1, this.htmlElement.media.load(); clearTimeout(this.internal.htmlDlyCmdId) }, _html_play: function (a) {
		var b = this; this._html_load(); this.htmlElement.media.play(); if (!isNaN(a)) try { this.htmlElement.media.currentTime = a } catch (d) {
			this.internal.htmlDlyCmdId = setTimeout(function () { b.play(a) },
100); return
		} this._html_checkWaitForPlay()
	}, _html_pause: function (a) { var b = this; a > 0 ? this._html_load() : clearTimeout(this.internal.htmlDlyCmdId); this.htmlElement.media.pause(); if (!isNaN(a)) try { this.htmlElement.media.currentTime = a } catch (d) { this.internal.htmlDlyCmdId = setTimeout(function () { b.pause(a) }, 100); return } a > 0 && this._html_checkWaitForPlay() }, _html_playHead: function (a) {
		var b = this; this._html_load(); try {
			if (typeof this.htmlElement.media.seekable === "object" && this.htmlElement.media.seekable.length > 0) this.htmlElement.media.currentTime =
a * this.htmlElement.media.seekable.end(this.htmlElement.media.seekable.length - 1) / 100; else if (this.htmlElement.media.duration > 0 && !isNaN(this.htmlElement.media.duration)) this.htmlElement.media.currentTime = a * this.htmlElement.media.duration / 100; else throw "e";
		} catch (d) { this.internal.htmlDlyCmdId = setTimeout(function () { b.playHead(a) }, 100); return } this.status.waitForLoad || this._html_checkWaitForPlay()
	}, _html_checkWaitForPlay: function () {
		if (this.status.waitForPlay) this.status.waitForPlay = !1, this.css.jq.videoPlay.length &&
this.css.jq.videoPlay.hide(), this.status.video && (this.internal.poster.jq.hide(), this.internal.video.jq.css({ width: this.status.width, height: this.status.height }))
	}, _html_volume: function (a) { if (this.html.audio.available) this.htmlElement.audio.volume = a; if (this.html.video.available) this.htmlElement.video.volume = a }, _html_mute: function (a) { if (this.html.audio.available) this.htmlElement.audio.muted = a; if (this.html.video.available) this.htmlElement.video.muted = a }, _flash_setAudio: function (a) {
		var c = this; try {
			if (b.each(this.formats,
function (b, d) { if (c.flash.support[d] && a[d]) { switch (d) { case "m4a": case "fla": c._getMovie().fl_setAudio_m4a(a[d]); break; case "mp3": c._getMovie().fl_setAudio_mp3(a[d]) } c.status.src = a[d]; c.status.format[d] = !0; c.status.formatType = d; return !1 } }), this.options.preload === "auto") this._flash_load(), this.status.waitForLoad = !1
		} catch (d) { this._flashError(d) } 
	}, _flash_setVideo: function (a) {
		var c = this; try {
			if (b.each(this.formats, function (b, d) {
				if (c.flash.support[d] && a[d]) {
					switch (d) { case "m4v": case "flv": c._getMovie().fl_setVideo_m4v(a[d]) } c.status.src =
a[d]; c.status.format[d] = !0; c.status.formatType = d; return !1
				} 
			}), this.options.preload === "auto") this._flash_load(), this.status.waitForLoad = !1
		} catch (d) { this._flashError(d) } 
	}, _flash_resetMedia: function () { this.internal.flash.jq.css({ width: "0px", height: "0px" }); this._flash_pause(NaN) }, _flash_clearMedia: function () { try { this._getMovie().fl_clearMedia() } catch (a) { this._flashError(a) } }, _flash_load: function () { try { this._getMovie().fl_load() } catch (a) { this._flashError(a) } this.status.waitForLoad = !1 }, _flash_play: function (a) {
		try { this._getMovie().fl_play(a) } catch (b) { this._flashError(b) } this.status.waitForLoad =
!1; this._flash_checkWaitForPlay()
	}, _flash_pause: function (a) { try { this._getMovie().fl_pause(a) } catch (b) { this._flashError(b) } if (a > 0) this.status.waitForLoad = !1, this._flash_checkWaitForPlay() }, _flash_playHead: function (a) { try { this._getMovie().fl_play_head(a) } catch (b) { this._flashError(b) } this.status.waitForLoad || this._flash_checkWaitForPlay() }, _flash_checkWaitForPlay: function () {
		if (this.status.waitForPlay) this.status.waitForPlay = !1, this.css.jq.videoPlay.length && this.css.jq.videoPlay.hide(), this.status.video &&
(this.internal.poster.jq.hide(), this.internal.flash.jq.css({ width: this.status.width, height: this.status.height }))
	}, _flash_volume: function (a) { try { this._getMovie().fl_volume(a) } catch (b) { this._flashError(b) } }, _flash_mute: function (a) { try { this._getMovie().fl_mute(a) } catch (b) { this._flashError(b) } }, _getMovie: function () { return document[this.internal.flash.id] }, _checkForFlash: function (a) {
		var b = !1, d; if (window.ActiveXObject) try { new ActiveXObject("ShockwaveFlash.ShockwaveFlash." + a), b = !0 } catch (e) { } else navigator.plugins &&
navigator.mimeTypes.length > 0 && (d = navigator.plugins["Shockwave Flash"]) && navigator.plugins["Shockwave Flash"].description.replace(/.*\s(\d+\.\d+).*/, "$1") >= a && (b = !0); return b
	}, _validString: function (a) { return a && typeof a === "string" }, _limitValue: function (a, b, d) { return a < b ? b : a > d ? d : a }, _urlNotSetError: function (a) { this._error({ type: b.jPlayer.error.URL_NOT_SET, context: a, message: b.jPlayer.errorMsg.URL_NOT_SET, hint: b.jPlayer.errorHint.URL_NOT_SET }) }, _flashError: function (a) {
		var c; c = this.internal.ready ? "FLASH_DISABLED" :
"FLASH"; this._error({ type: b.jPlayer.error[c], context: this.internal.flash.swf, message: b.jPlayer.errorMsg[c] + a.message, hint: b.jPlayer.errorHint[c] }); this.internal.flash.jq.css({ width: "1px", height: "1px" })
	}, _error: function (a) { this._trigger(b.jPlayer.event.error, a); this.options.errorAlerts && this._alert("Error!" + (a.message ? "\n\n" + a.message : "") + (a.hint ? "\n\n" + a.hint : "") + "\n\nContext: " + a.context) }, _warning: function (a) {
		this._trigger(b.jPlayer.event.warning, f, a); this.options.warningAlerts && this._alert("Warning!" +
(a.message ? "\n\n" + a.message : "") + (a.hint ? "\n\n" + a.hint : "") + "\n\nContext: " + a.context)
	}, _alert: function (a) { alert("jPlayer " + this.version.script + " : id='" + this.internal.self.id + "' : " + a) }, _emulateHtmlBridge: function () {
		var a = this; b.each(b.jPlayer.emulateMethods.split(/\s+/g), function (b, d) { a.internal.domNode[d] = function (b) { a[d](b) } }); b.each(b.jPlayer.event, function (c, d) {
			var e = !0; b.each(b.jPlayer.reservedEvent.split(/\s+/g), function (a, b) { if (b === c) return e = !1 }); e && a.element.bind(d + ".jPlayer.jPlayerHtml",
function () { a._emulateHtmlUpdate(); var b = document.createEvent("Event"); b.initEvent(c, !1, !0); a.internal.domNode.dispatchEvent(b) })
		})
	}, _emulateHtmlUpdate: function () { var a = this; b.each(b.jPlayer.emulateStatus.split(/\s+/g), function (b, d) { a.internal.domNode[d] = a.status[d] }); b.each(b.jPlayer.emulateOptions.split(/\s+/g), function (b, d) { a.internal.domNode[d] = a.options[d] }) }, _destroyHtmlBridge: function () {
		var a = this; this.element.unbind(".jPlayerHtml"); b.each((b.jPlayer.emulateMethods + " " + b.jPlayer.emulateStatus +
" " + b.jPlayer.emulateOptions).split(/\s+/g), function (b, d) { delete a.internal.domNode[d] })
	} 
}; b.jPlayer.error = { FLASH: "e_flash", FLASH_DISABLED: "e_flash_disabled", NO_SOLUTION: "e_no_solution", NO_SUPPORT: "e_no_support", URL: "e_url", URL_NOT_SET: "e_url_not_set", VERSION: "e_version" }; b.jPlayer.errorMsg = { FLASH: "jPlayer's Flash fallback is not configured correctly, or a command was issued before the jPlayer Ready event. Details: ", FLASH_DISABLED: "jPlayer's Flash fallback has been disabled by the browser due to the CSS rules you have used. Details: ",
	NO_SOLUTION: "No solution can be found by jPlayer in this browser. Neither HTML nor Flash can be used.", NO_SUPPORT: "It is not possible to play any media format provided in setMedia() on this browser using your current options.", URL: "Media URL could not be loaded.", URL_NOT_SET: "Attempt to issue media playback commands, while no media url is set.", VERSION: "jPlayer " + b.jPlayer.prototype.version.script + " needs Jplayer.swf version " + b.jPlayer.prototype.version.needFlash + " but found "
}; b.jPlayer.errorHint =
{ FLASH: "Check your swfPath option and that Jplayer.swf is there.", FLASH_DISABLED: "Check that you have not display:none; the jPlayer entity or any ancestor.", NO_SOLUTION: "Review the jPlayer options: support and supplied.", NO_SUPPORT: "Video or audio formats defined in the supplied option are missing.", URL: "Check media URL is valid.", URL_NOT_SET: "Use setMedia() to set the media URL.", VERSION: "Update jPlayer files." }; b.jPlayer.warning = { CSS_SELECTOR_COUNT: "e_css_selector_count", CSS_SELECTOR_METHOD: "e_css_selector_method",
	CSS_SELECTOR_STRING: "e_css_selector_string", OPTION_KEY: "e_option_key"
}; b.jPlayer.warningMsg = { CSS_SELECTOR_COUNT: "The number of css selectors found did not equal one: ", CSS_SELECTOR_METHOD: "The methodName given in jPlayer('cssSelector') is not a valid jPlayer method.", CSS_SELECTOR_STRING: "The methodCssSelector given in jPlayer('cssSelector') is not a String or is empty.", OPTION_KEY: "The option requested in jPlayer('option') is undefined." }; b.jPlayer.warningHint = { CSS_SELECTOR_COUNT: "Check your css selector and the ancestor.",
	CSS_SELECTOR_METHOD: "Check your method name.", CSS_SELECTOR_STRING: "Check your css selector is a string.", OPTION_KEY: "Check your option name."
}
})(jQuery);

/*
* Playlist Object for the jPlayer Plugin
* http://www.jplayer.org
*
* Copyright (c) 2009 - 2011 Happyworm Ltd
* Dual licensed under the MIT and GPL licenses.
*  - http://www.opensource.org/licenses/mit-license.php
*  - http://www.gnu.org/copyleft/gpl.html
*
* Author: Mark J Panaghiston
* Version: 2.1.0 (jPlayer 2.1.0)
* Date: 1st September 2011
*/

(function (b, f) {
	jPlayerPlaylist = function (a, c, d) {
		var e = this; this.current = 0; this.removing = this.shuffled = this.loop = !1; this.cssSelector = b.extend({}, this._cssSelector, a); this.options = b.extend(!0, {}, this._options, d); this.playlist = []; this.original = []; this._initPlaylist(c); this.cssSelector.title = this.cssSelector.cssSelectorAncestor + " .jp-title"; this.cssSelector.playlist = this.cssSelector.cssSelectorAncestor + " .jp-playlist"; this.cssSelector.next = this.cssSelector.cssSelectorAncestor + " .jp-next"; this.cssSelector.previous =
this.cssSelector.cssSelectorAncestor + " .jp-previous"; this.cssSelector.shuffle = this.cssSelector.cssSelectorAncestor + " .jp-shuffle"; this.cssSelector.shuffleOff = this.cssSelector.cssSelectorAncestor + " .jp-shuffle-off"; this.options.cssSelectorAncestor = this.cssSelector.cssSelectorAncestor; this.options.repeat = function (a) { e.loop = a.jPlayer.options.loop }; b(this.cssSelector.jPlayer).bind(b.jPlayer.event.ready, function () { e._init() }); b(this.cssSelector.jPlayer).bind(b.jPlayer.event.ended, function () { e.next() });
		b(this.cssSelector.jPlayer).bind(b.jPlayer.event.play, function () { b(this).jPlayer("pauseOthers") }); b(this.cssSelector.jPlayer).bind(b.jPlayer.event.resize, function (a) { a.jPlayer.options.fullScreen ? b(e.cssSelector.title).show() : b(e.cssSelector.title).hide() }); b(this.cssSelector.previous).click(function () { e.previous(); b(this).blur(); return !1 }); b(this.cssSelector.next).click(function () { e.next(); b(this).blur(); return !1 }); b(this.cssSelector.shuffle).click(function () { e.shuffle(!0); return !1 }); b(this.cssSelector.shuffleOff).click(function () {
			e.shuffle(!1);
			return !1
		}).hide(); this.options.fullScreen || b(this.cssSelector.title).hide(); b(this.cssSelector.playlist + " ul").empty(); this._createItemHandlers(); b(this.cssSelector.jPlayer).jPlayer(this.options)
	}; jPlayerPlaylist.prototype = { _cssSelector: { jPlayer: "#jquery_jplayer_1", cssSelectorAncestor: "#jp_container_1" }, _options: { playlistOptions: { autoPlay: !1, loopOnPrevious: !1, shuffleOnLoop: !0, enableRemoveControls: !1, displayTime: "", addTime: "fast", removeTime: "fast", shuffleTime: "", itemClass: "jp-playlist-item",
		freeGroupClass: "jp-free-media", freeItemClass: "jp-playlist-item-free", removeItemClass: "jp-playlist-item-remove"
	}
	}, option: function (a, b) { if (b === f) return this.options.playlistOptions[a]; this.options.playlistOptions[a] = b; switch (a) { case "enableRemoveControls": this._updateControls(); break; case "itemClass": case "freeGroupClass": case "freeItemClass": case "removeItemClass": this._refresh(!0), this._createItemHandlers() } return this }, _init: function () {
		var a = this; this._refresh(function () {
			a.options.playlistOptions.autoPlay ?
a.play(a.current) : a.select(a.current)
		})
	}, _initPlaylist: function (a) { this.current = 0; this.removing = this.shuffled = !1; this.original = b.extend(!0, [], a); this._originalPlaylist() }, _originalPlaylist: function () { var a = this; this.playlist = []; b.each(this.original, function (b) { a.playlist[b] = a.original[b] }) }, _refresh: function (a) {
		var c = this; if (a && !b.isFunction(a)) b(this.cssSelector.playlist + " ul").empty(), b.each(this.playlist, function (a) { b(c.cssSelector.playlist + " ul").append(c._createListItem(c.playlist[a])) }), this._updateControls();
		else { var d = b(this.cssSelector.playlist + " ul").children().length ? this.options.playlistOptions.displayTime : 0; b(this.cssSelector.playlist + " ul").slideUp(d, function () { var d = b(this); b(this).empty(); b.each(c.playlist, function (a) { d.append(c._createListItem(c.playlist[a])) }); c._updateControls(); b.isFunction(a) && a(); c.playlist.length ? b(this).slideDown(c.options.playlistOptions.displayTime) : b(this).show() }) } 
	}, _createListItem: function (a) {
		var c = this, d = "<li><div>"; d += "<a href='javascript:;' class='" + this.options.playlistOptions.removeItemClass +
"'>&times;</a>"; if (a.free) { var e = !0; d += "<span class='" + this.options.playlistOptions.freeGroupClass + "'>("; b.each(a, function (a, f) { b.jPlayer.prototype.format[a] && (e ? e = !1 : d += " | ", d += "<a class='" + c.options.playlistOptions.freeItemClass + "' href='" + f + "' tabindex='1'>" + a + "</a>") }); d += ")</span>" } d += "<a href='javascript:;' class='" + this.options.playlistOptions.itemClass + "' tabindex='1'>" + a.title + (a.artist ? " <span class='jp-artist'>by " + a.artist + "</span>" : "") + "</a>"; d += "</div></li>"; return d
	}, _createItemHandlers: function () {
		var a =
this; b(this.cssSelector.playlist + " a." + this.options.playlistOptions.itemClass).die("click").live("click", function () { var c = b(this).parent().parent().index(); a.current !== c ? a.play(c) : b(a.cssSelector.jPlayer).jPlayer("play"); b(this).blur(); return !1 }); b(a.cssSelector.playlist + " a." + this.options.playlistOptions.freeItemClass).die("click").live("click", function () { b(this).parent().parent().find("." + a.options.playlistOptions.itemClass).click(); b(this).blur(); return !1 }); b(a.cssSelector.playlist + " a." + this.options.playlistOptions.removeItemClass).die("click").live("click",
function () { var c = b(this).parent().parent().index(); a.remove(c); b(this).blur(); return !1 })
	}, _updateControls: function () { this.options.playlistOptions.enableRemoveControls ? b(this.cssSelector.playlist + " ." + this.options.playlistOptions.removeItemClass).show() : b(this.cssSelector.playlist + " ." + this.options.playlistOptions.removeItemClass).hide(); this.shuffled ? (b(this.cssSelector.shuffleOff).show(), b(this.cssSelector.shuffle).hide()) : (b(this.cssSelector.shuffleOff).hide(), b(this.cssSelector.shuffle).show()) },
		_highlight: function (a) { this.playlist.length && a !== f && (b(this.cssSelector.playlist + " .jp-playlist-current").removeClass("jp-playlist-current"), b(this.cssSelector.playlist + " li:nth-child(" + (a + 1) + ")").addClass("jp-playlist-current").find(".jp-playlist-item").addClass("jp-playlist-current"), b(this.cssSelector.title + " li").html(this.playlist[a].title + (this.playlist[a].artist ? " <span class='jp-artist'>by " + this.playlist[a].artist + "</span>" : ""))) }, setPlaylist: function (a) { this._initPlaylist(a); this._init() },
		add: function (a, c) { b(this.cssSelector.playlist + " ul").append(this._createListItem(a)).find("li:last-child").hide().slideDown(this.options.playlistOptions.addTime); this._updateControls(); this.original.push(a); this.playlist.push(a); c ? this.play(this.playlist.length - 1) : this.original.length === 1 && this.select(0) }, remove: function (a) {
			var c = this; if (a === f) return this._initPlaylist([]), this._refresh(function () { b(c.cssSelector.jPlayer).jPlayer("clearMedia") }), !0; else if (this.removing) return !1; else {
				a = a < 0 ? c.original.length +
a : a; if (0 <= a && a < this.playlist.length) this.removing = !0, b(this.cssSelector.playlist + " li:nth-child(" + (a + 1) + ")").slideUp(this.options.playlistOptions.removeTime, function () {
	b(this).remove(); if (c.shuffled) { var d = c.playlist[a]; b.each(c.original, function (a) { if (c.original[a] === d) return c.original.splice(a, 1), !1 }) } else c.original.splice(a, 1); c.playlist.splice(a, 1); c.original.length ? a === c.current ? (c.current = a < c.original.length ? c.current : c.original.length - 1, c.select(c.current)) : a < c.current && c.current-- : (b(c.cssSelector.jPlayer).jPlayer("clearMedia"),
c.current = 0, c.shuffled = !1, c._updateControls()); c.removing = !1
}); return !0
			} 
		}, select: function (a) { a = a < 0 ? this.original.length + a : a; 0 <= a && a < this.playlist.length ? (this.current = a, this._highlight(a), b(this.cssSelector.jPlayer).jPlayer("setMedia", this.playlist[this.current])) : this.current = 0 }, play: function (a) { a = a < 0 ? this.original.length + a : a; 0 <= a && a < this.playlist.length ? this.playlist.length && (this.select(a), b(this.cssSelector.jPlayer).jPlayer("play")) : a === f && b(this.cssSelector.jPlayer).jPlayer("play") }, pause: function () { b(this.cssSelector.jPlayer).jPlayer("pause") },
		next: function () { var a = this.current + 1 < this.playlist.length ? this.current + 1 : 0; this.loop ? a === 0 && this.shuffled && this.options.playlistOptions.shuffleOnLoop && this.playlist.length > 1 ? this.shuffle(!0, !0) : this.play(a) : a > 0 && this.play(a) }, previous: function () { var a = this.current - 1 >= 0 ? this.current - 1 : this.playlist.length - 1; (this.loop && this.options.playlistOptions.loopOnPrevious || a < this.playlist.length - 1) && this.play(a) }, shuffle: function (a, c) {
			var d = this; a === f && (a = !this.shuffled); (a || a !== this.shuffled) && b(this.cssSelector.playlist +
" ul").slideUp(this.options.playlistOptions.shuffleTime, function () { (d.shuffled = a) ? d.playlist.sort(function () { return 0.5 - Math.random() }) : d._originalPlaylist(); d._refresh(!0); c || !b(d.cssSelector.jPlayer).data("jPlayer").status.paused ? d.play(0) : d.select(0); b(this).slideDown(d.options.playlistOptions.shuffleTime) })
		} 
	}
})(jQuery);

/*global jQuery */
/*! 
* FitVids 1.0
*
* Copyright 2011, Chris Coyier - http://css-tricks.com + Dave Rupert - http://daverupert.com
* Credit to Thierry Koblentz - http://www.alistapart.com/articles/creating-intrinsic-ratios-for-video/
* Released under the WTFPL license - http://sam.zoy.org/wtfpl/
*
* Date: Thu Sept 01 18:00:00 2011 -0500
*/

(function (a) { a.fn.fitVids = function (b) { var c = { customSelector: null }; var d = document.createElement("div"), e = document.getElementsByTagName("base")[0] || document.getElementsByTagName("script")[0]; d.className = "fit-vids-style"; d.innerHTML = "Â­<style>               .fluid-width-video-wrapper {                 width: 100%;                              position: relative;                       padding: 0;                            }                                                                                   .fluid-width-video-wrapper iframe,        .fluid-width-video-wrapper object,        .fluid-width-video-wrapper embed {           position: absolute;                       top: 0;                                   left: 0;                                  width: 100%;                              height: 100%;                          }                                       </style>"; e.parentNode.insertBefore(d, e); if (b) { a.extend(c, b) } return this.each(function () { var b = ["iframe[src*='player.vimeo.com']", "iframe[src*='www.youtube.com']", "iframe[src*='www.kickstarter.com']", "object", "embed"]; if (c.customSelector) { b.push(c.customSelector) } var d = a(this).find(b.join(",")); d.each(function () { var b = a(this); if (this.tagName.toLowerCase() == "embed" && b.parent("object").length || b.parent(".fluid-width-video-wrapper").length) { return } var c = this.tagName.toLowerCase() == "object" ? b.attr("height") : b.height(), d = c / b.width(); if (!b.attr("id")) { var e = "fitvid" + Math.floor(Math.random() * 999999); b.attr("id", e) } b.wrap('<div class="fluid-width-video-wrapper"></div>').parent(".fluid-width-video-wrapper").css("padding-top", d * 100 + "%"); b.removeAttr("height").removeAttr("width") }) }) } })(jQuery)

if (!String.prototype.trim) {
    String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g, '');};
}


/*
 * SimpleModal 1.4.4 - jQuery Plugin
 * http://simplemodal.com/
 * Copyright (c) 2013 Eric Martin
 * Licensed under MIT and GPL
 * Date: Sun, Jan 20 2013 15:58:56 -0800
 */
(function (b) { "function" === typeof define && define.amd ? define(["jquery"], b) : b(jQuery) })(function (b) {
    var j = [], n = b(document), k = navigator.userAgent.toLowerCase(), l = b(window), g = [], o = null, p = /msie/.test(k) && !/opera/.test(k), q = /opera/.test(k), m, r; m = p && /msie 6./.test(k) && "object" !== typeof window.XMLHttpRequest; r = p && /msie 7.0/.test(k); b.modal = function (a, h) { return b.modal.impl.init(a, h) }; b.modal.close = function () { b.modal.impl.close() }; b.modal.focus = function (a) { b.modal.impl.focus(a) }; b.modal.setContainerDimensions =
    function () { b.modal.impl.setContainerDimensions() }; b.modal.setPosition = function () { b.modal.impl.setPosition() }; b.modal.update = function (a, h) { b.modal.impl.update(a, h) }; b.fn.modal = function (a) { return b.modal.impl.init(this, a) }; b.modal.defaults = {
        appendTo: "body", focus: !0, opacity: 50, overlayId: "simplemodal-overlay", overlayCss: {}, containerId: "simplemodal-container", containerCss: {}, dataId: "simplemodal-data", dataCss: {}, minHeight: null, minWidth: null, maxHeight: null, maxWidth: null, autoResize: !1, autoPosition: !0, zIndex: 1E3,
        close: !0, closeHTML: '<a class="modalCloseImg" title="Close"></a>', closeClass: "simplemodal-close", escClose: !0, overlayClose: !1, absolute: !0, position: null, persist: !1, modal: !0, onOpen: null, onShow: null, onClose: null
    }; b.modal.impl = {
        d: {}, init: function (a, h) {
            if (this.d.data) return !1; o = p && !b.support.boxModel; this.o = b.extend({}, b.modal.defaults, h); this.zIndex = this.o.zIndex; this.occb = !1; if ("object" === typeof a) {
                if (a = a instanceof b ? a : b(a), this.d.placeholder = !1, 0 < a.parent().parent().size() && (a.before(b("<span></span>").attr("id",
                "simplemodal-placeholder").css({ display: "none" })), this.d.placeholder = !0, this.display = a.css("display"), !this.o.persist)) this.d.orig = a.clone(!0)
            } else if ("string" === typeof a || "number" === typeof a) a = b("<div></div>").html(a); else return alert("SimpleModal Error: Unsupported data type: " + typeof a), this; this.create(a); this.open(); b.isFunction(this.o.onShow) && this.o.onShow.apply(this, [this.d]); return this
        }, create: function (a) {
            this.getDimensions(); if (this.o.modal && m) this.d.iframe = b('<iframe src="javascript:false;"></iframe>').css(b.extend(this.o.iframeCss,
            { display: "none", opacity: 0, position: "absolute", height: g[0], width: g[1], zIndex: this.o.zIndex, top: 0, left: 0 })).appendTo(this.o.appendTo); this.d.overlay = b("<div></div>").attr("id", this.o.overlayId).addClass("simplemodal-overlay").css(b.extend(this.o.overlayCss, { display: "none", opacity: this.o.opacity / 100, height: this.o.modal ? j[0] : 0, width: this.o.modal ? j[1] : 0, position: "absolute", left: 0, top: 128, zIndex: this.o.zIndex + 1 })).appendTo(this.o.appendTo); this.d.container = b("<div></div>").attr("id", this.o.containerId).addClass("simplemodal-container").css(b.extend({
                position: this.o.absolute ?
                "absolute" : "absolute"
            }, this.o.containerCss, { display: "none", zIndex: this.o.zIndex + 2 })).append(this.o.close && this.o.closeHTML ? b(this.o.closeHTML).addClass(this.o.closeClass) : "").appendTo(this.o.appendTo); this.d.wrap = b("<div></div>").attr("tabIndex", -1).addClass("simplemodal-wrap").css({ height: "100%", outline: 0, width: "100%" }).appendTo(this.d.container); this.d.data = a.attr("id", a.attr("id") || this.o.dataId).addClass("simplemodal-data").css(b.extend(this.o.dataCss, { display: "none" })).appendTo("body"); this.setContainerDimensions();
            this.d.data.appendTo(this.d.wrap); (m || o) && this.fixIE()
        }, bindEvents: function () {
            var a = this; b("." + a.o.closeClass).bind("click.simplemodal", function (b) { b.preventDefault(); a.close() }); a.o.modal && a.o.close && a.o.overlayClose && a.d.overlay.bind("click.simplemodal", function (b) { b.preventDefault(); a.close() }); n.bind("keydown.simplemodal", function (b) { a.o.modal && 9 === b.keyCode ? a.watchTab(b) : a.o.close && a.o.escClose && 27 === b.keyCode && (b.preventDefault(), a.close()) }); l.bind("resize.simplemodal orientationchange.simplemodal",
            function () { a.getDimensions(); a.o.autoResize ? a.setContainerDimensions() : a.o.autoPosition && a.setPosition(); m || o ? a.fixIE() : a.o.modal && (a.d.iframe && a.d.iframe.css({ height: g[0], width: g[1] }), a.d.overlay.css({ height: j[0], width: j[1] })) })
        }, unbindEvents: function () { b("." + this.o.closeClass).unbind("click.simplemodal"); n.unbind("keydown.simplemodal"); l.unbind(".simplemodal"); this.d.overlay.unbind("click.simplemodal") }, fixIE: function () {
            var a = this.o.position; b.each([this.d.iframe || null, !this.o.modal ? null : this.d.overlay,
            "absolute" === this.d.container.css("position") ? this.d.container : null], function (b, e) {
                if (e) {
                    var f = e[0].style; f.position = "absolute"; if (2 > b) f.removeExpression("height"), f.removeExpression("width"), f.setExpression("height", 'document.body.scrollHeight > document.body.clientHeight ? document.body.scrollHeight : document.body.clientHeight + "px"'), f.setExpression("width", 'document.body.scrollWidth > document.body.clientWidth ? document.body.scrollWidth : document.body.clientWidth + "px"'); else {
                        var c, d; a && a.constructor ===
                        Array ? (c = a[0] ? "number" === typeof a[0] ? a[0].toString() : a[0].replace(/px/, "") : e.css("top").replace(/px/, ""), c = -1 === c.indexOf("%") ? c + ' + (t = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + "px"' : parseInt(c.replace(/%/, "")) + ' * ((document.documentElement.clientHeight || document.body.clientHeight) / 100) + (t = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + "px"', a[1] && (d = "number" === typeof a[1] ?
                        a[1].toString() : a[1].replace(/px/, ""), d = -1 === d.indexOf("%") ? d + ' + (t = document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft) + "px"' : parseInt(d.replace(/%/, "")) + ' * ((document.documentElement.clientWidth || document.body.clientWidth) / 100) + (t = document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft) + "px"')) : (c = '(document.documentElement.clientHeight || document.body.clientHeight) / 2 - (this.offsetHeight / 2) + (t = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + "px"',
                        d = '(document.documentElement.clientWidth || document.body.clientWidth) / 2 - (this.offsetWidth / 2) + (t = document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft) + "px"'); f.removeExpression("top"); f.removeExpression("left"); f.setExpression("top", c); f.setExpression("left", d)
                    }
                }
            })
        }, focus: function (a) {
            var h = this, a = a && -1 !== b.inArray(a, ["first", "last"]) ? a : "first", e = b(":input:enabled:visible:" + a, h.d.wrap); setTimeout(function () { 0 < e.length ? e.focus() : h.d.wrap.focus() },
            10)
        }, getDimensions: function () { var a = "undefined" === typeof window.innerHeight ? l.height() : window.innerHeight; j = [n.height(), n.width()]; g = [a, l.width()] }, getVal: function (a, b) { return a ? "number" === typeof a ? a : "auto" === a ? 0 : 0 < a.indexOf("%") ? parseInt(a.replace(/%/, "")) / 100 * ("h" === b ? g[0] : g[1]) : parseInt(a.replace(/px/, "")) : null }, update: function (a, b) {
            if (!this.d.data) return !1; this.d.origHeight = this.getVal(a, "h"); this.d.origWidth = this.getVal(b, "w"); this.d.data.hide(); a && this.d.container.css("height", a); b && this.d.container.css("width",
            b); this.setContainerDimensions(); this.d.data.show(); this.o.focus && this.focus(); this.unbindEvents(); this.bindEvents()
        }, setContainerDimensions: function () {
            var a = m || r, b = this.d.origHeight ? this.d.origHeight : q ? this.d.container.height() : this.getVal(a ? this.d.container[0].currentStyle.height : this.d.container.css("height"), "h"), a = this.d.origWidth ? this.d.origWidth : q ? this.d.container.width() : this.getVal(a ? this.d.container[0].currentStyle.width : this.d.container.css("width"), "w"), e = this.d.data.outerHeight(!0), f =
            this.d.data.outerWidth(!0); this.d.origHeight = this.d.origHeight || b; this.d.origWidth = this.d.origWidth || a; var c = this.o.maxHeight ? this.getVal(this.o.maxHeight, "h") : null, d = this.o.maxWidth ? this.getVal(this.o.maxWidth, "w") : null, c = c && c < g[0] ? c : g[0], d = d && d < g[1] ? d : g[1], i = this.o.minHeight ? this.getVal(this.o.minHeight, "h") : "auto", b = b ? this.o.autoResize && b > c ? c : b < i ? i : b : e ? e > c ? c : this.o.minHeight && "auto" !== i && e < i ? i : e : i, c = this.o.minWidth ? this.getVal(this.o.minWidth, "w") : "auto", a = a ? this.o.autoResize && a > d ? d : a < c ? c : a : f ?
            f > d ? d : this.o.minWidth && "auto" !== c && f < c ? c : f : c; this.d.container.css({ height: b, width: a }); this.d.wrap.css({ overflow: e > b || f > a ? "auto" : "visible" }); this.o.autoPosition && this.setPosition()
        }, setPosition: function () {
            var a, b; a = g[0] / 2 - this.d.container.outerHeight(!0) / 2; b = g[1] / 2 - this.d.container.outerWidth(!0) / 2; var e = "absolute" !== this.d.container.css("position") ? l.scrollTop() : 0; this.o.position && "[object Array]" === Object.prototype.toString.call(this.o.position) ? (a = e + (this.o.position[0] || a), b = this.o.position[1] || b) :
            a = e + a; this.d.container.css({ left: b, top: a })
        }, watchTab: function (a) { if (0 < b(a.target).parents(".simplemodal-container").length) { if (this.inputs = b(":input:enabled:visible:first, :input:enabled:visible:last", this.d.data[0]), !a.shiftKey && a.target === this.inputs[this.inputs.length - 1] || a.shiftKey && a.target === this.inputs[0] || 0 === this.inputs.length) a.preventDefault(), this.focus(a.shiftKey ? "last" : "first") } else a.preventDefault(), this.focus() }, open: function () {
            this.d.iframe && this.d.iframe.show(); b.isFunction(this.o.onOpen) ?
            this.o.onOpen.apply(this, [this.d]) : (this.d.overlay.show(), this.d.container.show(), this.d.data.show()); this.o.focus && this.focus(); this.bindEvents()
        }, close: function () {
            if (!this.d.data) return !1; this.unbindEvents(); if (b.isFunction(this.o.onClose) && !this.occb) this.occb = !0, this.o.onClose.apply(this, [this.d]); else {
                if (this.d.placeholder) { var a = b("#simplemodal-placeholder"); this.o.persist ? a.replaceWith(this.d.data.removeClass("simplemodal-data").css("display", this.display)) : (this.d.data.hide().remove(), a.replaceWith(this.d.orig)) } else this.d.data.hide().remove();
                this.d.container.hide().remove(); this.d.overlay.hide(); this.d.iframe && this.d.iframe.hide().remove(); this.d.overlay.remove(); this.d = {}
            }
        }
    }
});


/**
 * jQuery Masonry v2.1.08
 * A dynamic layout plugin for jQuery
 * The flip-side of CSS Floats
 * http://masonry.desandro.com
 *
 * Licensed under the MIT license.
 * Copyright 2012 David DeSandro
 */
(function (e, t, n) { "use strict"; var r = t.event, i; r.special.smartresize = { 
    setup: function () { t(this).bind("resize", r.special.smartresize.handler) }, teardown: function () { t(this).unbind("resize", r.special.smartresize.handler) }, handler: function (e, t) { var n = this, s = arguments; e.type = "smartresize", i && clearTimeout(i), i = setTimeout(function () { r.dispatch.apply(n, s) }, t === "execAsap" ? 0 : 100) }
}, t.fn.smartresize = function (e) { return e ? this.bind("smartresize", e) : this.trigger("smartresize", ["execAsap"]) }, t.Mason = function (e, n) { this.element = t(n), this._create(e), this._init() }, t.Mason.settings = { isResizable: !0, isAnimated: !1, animationOptions: { queue: !1, duration: 500 }, gutterWidth: 0, isRTL: !1, isFitWidth: !1, containerStyle: { position: "relative" } }, t.Mason.prototype = { _filterFindBricks: function (e) { var t = this.options.itemSelector; return t ? e.filter(t).add(e.find(t)) : e }, _getBricks: function (e) { var t = this._filterFindBricks(e).css({ position: "absolute" }).addClass("masonry-brick"); return t }, _create: function (n) { this.options = t.extend(!0, {}, t.Mason.settings, n), this.styleQueue = []; var r = this.element[0].style; this.originalStyle = { height: r.height || "" }; var i = this.options.containerStyle; for (var s in i) this.originalStyle[s] = r[s] || ""; this.element.css(i), this.horizontalDirection = this.options.isRTL ? "right" : "left"; var o = this.element.css("padding-" + this.horizontalDirection), u = this.element.css("padding-top"); this.offset = { x: o ? parseInt(o, 10) : 0, y: u ? parseInt(u, 10) : 0 }, this.isFluid = this.options.columnWidth && typeof this.options.columnWidth == "function"; var a = this; setTimeout(function () { a.element.addClass("masonry") }, 0), this.options.isResizable && t(e).bind("smartresize.masonry", function () { a.resize() }), this.reloadItems() }, _init: function (e) { this._getColumns(), this._reLayout(e) }, option: function (e, n) { t.isPlainObject(e) && (this.options = t.extend(!0, this.options, e)) }, layout: function (e, t) { for (var n = 0, r = e.length; n < r; n++) this._placeBrick(e[n]); var i = {}; i.height = Math.max.apply(Math, this.colYs); if (this.options.isFitWidth) { var s = 0; n = this.cols; while (--n) { if (this.colYs[n] !== 0) break; s++ } i.width = (this.cols - s) * this.columnWidth - this.options.gutterWidth } this.styleQueue.push({ $el: this.element, style: i }); var o = this.isLaidOut ? this.options.isAnimated ? "animate" : "css" : "css", u = this.options.animationOptions, a; for (n = 0, r = this.styleQueue.length; n < r; n++) a = this.styleQueue[n], a.$el[o](a.style, u); this.styleQueue = [], t && t.call(e), this.isLaidOut = !0 }, _getColumns: function () { var e = this.options.isFitWidth ? this.element.parent() : this.element, t = e.width(); this.columnWidth = this.isFluid ? this.options.columnWidth(t) : this.options.columnWidth || this.$bricks.outerWidth(!0) || t, this.columnWidth += this.options.gutterWidth, this.cols = Math.floor((t + this.options.gutterWidth) / this.columnWidth), this.cols = Math.max(this.cols, 1) }, _placeBrick: function (e) { var n = t(e), r, i, s, o, u; r = Math.ceil(n.outerWidth(!0) / this.columnWidth), r = Math.min(r, this.cols); if (r === 1) s = this.colYs; else { i = this.cols + 1 - r, s = []; for (u = 0; u < i; u++) o = this.colYs.slice(u, u + r), s[u] = Math.max.apply(Math, o) } var a = Math.min.apply(Math, s), f = 0; for (var l = 0, c = s.length; l < c; l++) if (s[l] === a) { f = l; break } var h = { top: a + this.offset.y }; h[this.horizontalDirection] = this.columnWidth * f + this.offset.x, this.styleQueue.push({ $el: n, style: h }); var p = a + n.outerHeight(!0), d = this.cols + 1 - c; for (l = 0; l < d; l++) this.colYs[f + l] = p }, resize: function () { var e = this.cols; this._getColumns(), (this.isFluid || this.cols !== e) && this._reLayout() }, _reLayout: function (e) { var t = this.cols; this.colYs = []; while (t--) this.colYs.push(0); this.layout(this.$bricks, e) }, reloadItems: function () { this.$bricks = this._getBricks(this.element.children()) }, reload: function (e) { this.reloadItems(), this._init(e) }, appended: function (e, t, n) { if (t) { this._filterFindBricks(e).css({ top: this.element.height() }); var r = this; setTimeout(function () { r._appended(e, n) }, 1) } else this._appended(e, n) }, _appended: function (e, t) { var n = this._getBricks(e); this.$bricks = this.$bricks.add(n), this.layout(n, t) }, remove: function (e) { this.$bricks = this.$bricks.not(e), e.remove() }, destroy: function () { this.$bricks.removeClass("masonry-brick").each(function () { this.style.position = "", this.style.top = "", this.style.left = "" }); var n = this.element[0].style; for (var r in this.originalStyle) n[r] = this.originalStyle[r]; this.element.unbind(".masonry").removeClass("masonry").removeData("masonry"), t(e).unbind(".masonry") } }, t.fn.imagesLoaded = function (e) { function u() { e.call(n, r) } function a(e) { var n = e.target; n.src !== s && t.inArray(n, o) === -1 && (o.push(n), --i <= 0 && (setTimeout(u), r.unbind(".imagesLoaded", a))) } var n = this, r = n.find("img").add(n.filter("img")), i = r.length, s = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==", o = []; return i || u(), r.bind("load.imagesLoaded error.imagesLoaded", a).each(function () { var e = this.src; this.src = s, this.src = e }), n }; var s = function (t) { e.console && e.console.error(t) }; t.fn.masonry = function (e) { if (typeof e == "string") { var n = Array.prototype.slice.call(arguments, 1); this.each(function () { var r = t.data(this, "masonry"); if (!r) { s("cannot call methods on masonry prior to initialization; attempted to call method '" + e + "'"); return } if (!t.isFunction(r[e]) || e.charAt(0) === "_") { s("no such method '" + e + "' for masonry instance"); return } r[e].apply(r, n) }) } else this.each(function () { var n = t.data(this, "masonry"); n ? (n.option(e || {}), n._init()) : t.data(this, "masonry", new t.Mason(e, this)) }); return this }
})(window, jQuery);

/*!
 * jQuery Cookie Plugin v1.4.0
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2013 Klaus Hartl
 * Released under the MIT license
 */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as anonymous module.
        define(['jquery'], factory);
    } else {
        // Browser globals.
        factory(jQuery);
    }
}(function ($) {

    var pluses = /\+/g;

    function encode(s) {
        return config.raw ? s : encodeURIComponent(s);
    }

    function decode(s) {
        return config.raw ? s : decodeURIComponent(s);
    }

    function stringifyCookieValue(value) {
        return encode(config.json ? JSON.stringify(value) : String(value));
    }

    function parseCookieValue(s) {
        if (s.indexOf('"') === 0) {
            // This is a quoted cookie as according to RFC2068, unescape...
            s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        }

        try {
            // Replace server-side written pluses with spaces.
            // If we can't decode the cookie, ignore it, it's unusable.
            s = decodeURIComponent(s.replace(pluses, ' '));
        } catch (e) {
            return;
        }

        try {
            // If we can't parse the cookie, ignore it, it's unusable.
            return config.json ? JSON.parse(s) : s;
        } catch (e) { }
    }

    function read(s, converter) {
        var value = config.raw ? s : parseCookieValue(s);
        return $.isFunction(converter) ? converter(value) : value;
    }

    var config = $.cookie = function (key, value, options) {

        // Write
        if (value !== undefined && !$.isFunction(value)) {
            options = $.extend({}, config.defaults, options);

            if (typeof options.expires === 'number') {
                var days = options.expires, t = options.expires = new Date();
                t.setDate(t.getDate() + days);
            }

            return (document.cookie = [
				encode(key), '=', stringifyCookieValue(value),
				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
				options.path ? '; path=' + options.path : '',
				options.domain ? '; domain=' + options.domain : '',
				options.secure ? '; secure' : ''
            ].join(''));
        }

        // Read

        var result = key ? undefined : {};

        // To prevent the for loop in the first place assign an empty array
        // in case there are no cookies at all. Also prevents odd result when
        // calling $.cookie().
        var cookies = document.cookie ? document.cookie.split('; ') : [];

        for (var i = 0, l = cookies.length; i < l; i++) {
            var parts = cookies[i].split('=');
            var name = decode(parts.shift());
            var cookie = parts.join('=');

            if (key && key === name) {
                // If second argument (value) is a function it's a converter...
                result = read(cookie, value);
                break;
            }

            // Prevent storing a cookie that we couldn't decode.
            if (!key && (cookie = read(cookie)) !== undefined) {
                result[name] = cookie;
            }
        }

        return result;
    };

    config.defaults = {};

    $.removeCookie = function (key, options) {
        if ($.cookie(key) !== undefined) {
            // Must not alter options, thus extending a fresh object...
            $.cookie(key, '', $.extend({}, options, { expires: -1 }));
            return true;
        }
        return false;
    };

}));
