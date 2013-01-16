# Aware.js
## Make Your Site Reader Aware

Aware.js is a simple jQuery plugin that allows a site to customize and personalize the display of content based on a reader's behavior
without requiring login, authentication, or any server-side processing.

[Read about the concept of "reader aware design."](http://notes.xoxco.com/post/36089202908/reader-aware-design)

[View Demo of Aware.js in action.](http://xoxco.com/projects/code/aware/demo.html) This demo uses Aware.js and CSS only to drastically alter the layout an otherwise static page in three different ways based on the reader's personalized relationship with the content.

Aware also provides a handy method for personalizing the display of content based on the time of day. 

[View Demo of Aware's time of day feature.](http://xoxco.com/projects/code/aware/time_of_day.html) This demo uses Aware.js and CSS only to change the mood of a page depending on what time it is.

Created by [XOXCO](http://xoxco.com)


## Download

[Get it from Github](https://github.com/xoxco/awarejs)

Aware.js is released under the MIT Open Source license. It's free to use, and you can use it however you want!

## Instructions

Aware.js bundles several features into one easy to implement library. To add it to your site, include the script tag, and then initiate the plugin:

	$().aware();

Aware.js will then leap into action, and perform a variety of useful functions like:

**Tracking the amount of time between a reader's visits**

Aware.js will track a reader's visits, and provide information about the reader's habits, making information available to developers via CSS classes AND via a Javascript *reader* object.

Classes will be added to the body tag to represent various states a reader might be in:

	.first-visit - This is the reader's first visit on record.
	
	.repeat-visitor - This reader has been to the site at least once before.
	
	.first-visit-of-day - This is a reader who has visited before, but not today.
	
In addition, the *reader* object contains this same information, along with some specific information about previous visits. This is useful for Javascript developers who want to add more dynamic features to their site based on this information (and who don't want to query the DOM for classes)

	reader.firstVisit	- true/false
	reader.repeatVisitor - true/false
	reader.firstVisitOfDay - true/false
	
	reader.lastVisit - Javascript Date object
	reader.secondsSinceLastVisit  - seconds since last visit
	reader.timeSinceLastVisit - relative timestamp "28 minutes"

This simple information can be used to mildly or drastically alter the layout of a page. For example, first time visitors can be shown a special introduction, while repeat visitors are shown only the newest things. Visitors who haven't come in a while can be presented with a recap of recent, important items.

**Flag Content As New or Seen**

Aware.js can also flag content on a page as new to the reader, helping them keep up-to-date without remembering what they read last visit.

To enable this, the publication date of each piece of content must be included as an HTML5 data attribute, *data-pubDate* in the format YYYY-MM-DD HH:MM:SS, as below:

	<div class="post" data-pubDate="2012-07-01 02:30:00">
		POST HERE
	</div>

Once these attributes are added to the markup, tell Aware.js to process them by passing in a element selector:

	$('.post').aware();
	
Any matching element with a date after the reader's last visit will have the *.new* class added. Any item with a date before the reader's last visit will have *.seen* added.

Highlight new elements by using the .new class in your CSS:

	.post.new {
		background: #FFFF99;
	}

**Track the reader's local time of day**

What if your site could look different during breakfast than it does late at night? Aware.js adds CSS classes based on the time of day.
Consider how your visitor's needs might be different as the natural cycle of the day progresses.

Is the sun out? Or is it dark? Aware.js adds a class for daytime and nighttime:

	.daytime
	.nighttime

There are additional classes for smaller slices of the day:

	.daytime
		.morning
			.earlymorning
			.latemorning
		.afternoon
			.noonish
			.earlyevening
	.nighttime
		.evening
		.night
		.latenight
		.early
		
In addition, the *reader* object contains this same information:

	reader.time_of_day - early,earlymorning, latemorning,
						 noonish,earlyevening,evening,night, or latenight
	reader.morning - true/false
	reader.afternoon - true/false
	reader.daytime - true/false
	reader.nighttime - true/false

	
**Insert Relative Bookmark**

Inspired by the Andre Torrez's image sharing site, [Mlkshk](http://mlkshk.com), Aware.js also provides a method for inserting relative bookmarks into the stream of content to clearly delineate content added since the reader's last visit. [See demo.](http://xoxco.com/projects/code/aware/demo.html)

![Shkmark Demo](http://xoxco.com/projects/code/aware/shkmark_example.png)

To inject a relative bookmark *below the last new post*, call the deferentially named *shkmark()* function after calling *aware()*. The relative bookmark will include the message, "You started reading here *timestamp* ago."

	$('.post').aware();
	$('.post').shkmark();

	// this would result in a div with class .bookmark being added:
	// <li class="shkmark">You started reading here 5 minutes ago</li>

## Options

Aware.js has several options that can be used to customize its behavior:

	$(optional_selector).aware({
		dateAttribute: 'data-pubDate', 
		// change the name of the attribute that contains the date


		bufferTime: 10*60*1000 
		// time in milliseconds that a freshly published piece 
		// of content should be flagged as new regardless of reader's last visit.
	});

By default, shkmarks are created as &lt;li&gt; elements with the class .shkmark, but these can be overridden:

	$(.post').shkmark({
		element: 'div',
		className: 'bookmark'
	});
	
	// this would result in a div with class .bookmark being added:
	// <div class="bookmark">You started reading here 5 minutes ago</div>
		
