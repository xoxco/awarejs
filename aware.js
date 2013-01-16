		(function($) {
		
			/*
			
				A Javascript library to help create dynamic 
				reader-aware interfaces to content.
							
				by Ben Brown ben@xoxco.com
			*/

			var lastVisit = false;
			var cookieRegex = new RegExp("(?:^|.*;\\s*)lastVisit\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*");

			/* Helpful little date helper here! */
			Date.prototype.getDOY = function() {
				var onejan = new Date(this.getFullYear(),0,1);
				return Math.ceil((this - onejan) / 86400000);
			}
			
			function setLastVisit(date) {
				if (window.localStorage) {					
					window.localStorage.setItem('lastVisit',date);
				} else {
					document.cookie = 'lastVisit=' + escape(date) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/";
				}
			}
			
	
			function getLastVisit() {
				if (window.localStorage) {
					return window.localStorage.getItem('lastVisit');
				} else {
					var maybeLastVisit = unescape(document.cookie.replace(cookieRegex, "$1"));
					return !isNaN(new Date(maybeLastVisit)) ? maybeLastVisit : null;
				}
			}
			
			function pluralizeString(num,str) {
				if (num==1) {
					return str;
				} else {
					return str+'s';
				}
			}
						
			function relativeTimestamp(ms) {
				var seconds = Math.floor(ms / 1000);

				if (seconds < 60) {
					return seconds + pluralizeString(seconds,' second');
				}
				
				var minutes = Math.floor(seconds/60);
				if (minutes < 60) {
					return minutes + pluralizeString(minutes,' minute');
				}

				var hours = Math.floor(minutes/60);
				if (hours < 24) {
					return hours + pluralizeString(hours,' hour');
				}

				var days = Math.floor(hours/24);
				if (days < 7) {
					return days + pluralizeString(days,' day');
				}

				var weeks = Math.floor(days/7);
				return weeks + pluralizeString(weeks,' week');
				
			}
			
			
			// insert a bookmark with a relative timestamp after the last new item on the page.
			$.fn.shkmark = function(options) {
				var settings = {
					'className': 'shkmark',
					'element': 'li',
					'newIndicator':'.new'
				}
				
				$.extend(settings,options);

				if (!$(this).length || !$(this).filter(settings.newIndicator).length) {
					return;
				}
								
				if (!lastVisit) {
					lastVisit = getLastVisit();
				}
				if (!lastVisit) { return; }
				lastVisit = new Date(lastVisit);
				var now = new Date();
				
				var message = 'You started reading here ' + relativeTimestamp(now-lastVisit) + ' ago';
				
				var bookmark = document.createElement(settings.element);
				$(bookmark).addClass(settings.className);
				$(bookmark).html(message);
				

				if($(this).last()[0]!=$(this).filter(settings.newIndicator)[0]) {
					$(this).filter(settings.newIndicator).last().after(bookmark);
				}
				
				
			}
		
			$.fn.time_of_day = function(time_of_day) {
				// What time of day is it? 
				// Is it sunny or dark?
				// Is it lunch time? Or late night?
				/* 
				
					4-7 early morning
					7-11 morning / breakfast time
					11-13 noonish / lunch time
					13-16 afternoon
					16-19 early evening
					19-21 evening / dinner time
					21-23 night
					23-4 latenight
					
					7-19 daytime
					19-7 nighttime
								
				*/				
				reader.morning = reader.afternoon = reader.lunchtime = reader.daytime = reader.nighttime = false;
				if (time_of_day >= 4 && time_of_day < 6) {
					reader.time_of_day = 'early';
				} else if (time_of_day >= 6 && time_of_day < 8) {
					reader.time_of_day = 'earlymorning';
					reader.morning = true;
				} else if (time_of_day >= 8 && time_of_day < 11) {
					reader.time_of_day = 'latemorning';
					reader.morning = true;
				} else if (time_of_day >= 11 && time_of_day < 13) {
					reader.time_of_day = 'noonish';
					reader.afternoon = true;
					reader.lunchtime = true; // this is an illusion.
				} else if (time_of_day >= 13 && time_of_day < 16) {
					reader.time_of_day = 'afternoon';
					reader.afternoon = true;
				} else if (time_of_day >= 16 && time_of_day < 19) {
					reader.time_of_day = 'earlyevening';
					reader.afternoon = true;
				} else if (time_of_day >= 19 && time_of_day < 21) {
					reader.time_of_day = 'evening';
				} else if (time_of_day >= 21 && time_of_day < 23) {
					reader.time_of_day = 'night';
				} else if (time_of_day >= 23 || time_of_day < 4) {
					reader.time_of_day = 'latenight';
				}
				
				if (time_of_day >= 6 && time_of_day <19) {
					reader.daytime = true;
					$('body').addClass('daytime');

				} else {
					reader.nighttime = true;
					$('body').addClass('nighttime');
				}

				if (reader.morning) {
					$('body').addClass('morning');
				}
				if (reader.afternoon) {
					$('body').addClass('afternoon');
				}
				
				$('body').addClass(reader.time_of_day);				
				
			}
			
			$.fn.aware = function(options) {
				
				var settings = {
					dateAttribute: 'data-pubDate',
					bufferTime: 60*60*1000 // by default, leave things new if they are an hour old or less

				}				

				var reader = {};

				
				$.extend(settings,options);
				
				// retrieve user's last visit timestamp
				// but make sure not to override it if already set once this session!
				if (!lastVisit) {
					lastVisit = getLastVisit();
				}
				var now = new Date();
				if (!lastVisit) {
					setLastVisit(now);
					$('body').addClass('first-visit');
					reader.lastVisit = now;
					reader.firstVisit = true;
					reader.secondsSinceLastVisit = 0;
					window.reader = reader;
				} else {
					lastVisit = new Date(lastVisit);
					reader.lastVisit = lastVisit;

					if (lastVisit.getDOY() < now.getDOY()) {
						$('body').addClass('first-visit-of-day');
						$('body').addClass('repeat-visitor');
						reader.firstVisitOfDay = true;
						reader.repeatVisitor = true;
	
					} else {
						if (!$('body').hasClass('first-visit')) {
							$('body').addClass('repeat-visitor');
							reader.repeatVisitor = true;
						}
					}
				}
								
				if (!reader.firstVisit) {
					this.each(function() {
						// find the date element
						var postDate = $(this).attr(settings.dateAttribute);
						if (postDate) {
							var arr = postDate.split(/[- :]/);
						    postTimestamp = new Date(arr[0], arr[1]-1, arr[2], arr[3], arr[4], arr[5]);
							if (postTimestamp > lastVisit-settings.bufferTime) {
								$(this).addClass('new');
							} else {
								$(this).addClass('seen');
							}
	
						}
						
					});
				}
				

				reader.secondsSinceLastVisit = Math.floor((now-lastVisit)/1000);
				reader.timeSinceLastVisit = relativeTimestamp(now-lastVisit);

				window.reader = reader;

				$.fn.time_of_day(new Date().getHours());

				
				setLastVisit(now);
			}			
		
		})(jQuery);