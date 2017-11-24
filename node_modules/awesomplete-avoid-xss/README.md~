# Awesomplete

http://leaverou.github.io/awesomplete/

Awesomplete is an ultra lightweight, customizable, simple autocomplete widget with zero dependencies, built with modern standards for modern browsers.

[![npm version](https://img.shields.io/npm/v/awesomplete-avoid-xss.svg)](https://www.npmjs.com/package/awesomplete-avoid-xss)
[![Build Status](https://img.shields.io/travis/jcbrand/awesomplete/gh-pages.svg)](https://travis-ci.org/jcbrand/awesomplete)
[![Code Climate](https://img.shields.io/codeclimate/github/jcbrand/awesomplete.svg)](https://codeclimate.com/github/jcbrand/awesomplete)
[![Test Coverage](https://img.shields.io/codeclimate/coverage/github/jcbrand/awesomplete.svg)](https://codeclimate.com/github/jcbrand/awesomplete/coverage)

## Why was this forked?

The upstream version of Awesomplete currently renders suggestions as HTML.

If the suggestion text is somehow derived from user-generated data, then it
might be possible for an attacker to craft a malicious script that will execute
as soon as it is rendered as a suggestion by awesomeplete.

This fork adds a patch which makes sure that the suggestion text is rendered as
`textContent` and not as HTML.

A pull request with this patch was rejected by the upstream project, without
any alternative solution being proposed.

See https://github.com/LeaVerou/awesomplete/pull/17082

This leaves upstream awesomplete vulnerable to the above mentioned attack
(under the right circumstances).

## Basic Usage

Before you try anything, you need to include awesomplete.css and awesomplete.js in your page, via the usual tags:

```html
<link rel="stylesheet" href="awesomplete.css" />
<script src="awesomplete.js" async></script>
```

Then you can add an Awesomplete widget by adding the following input tag:

```html
<input class="awesomplete"
       data-list="Ada, Java, JavaScript, Brainfuck, LOLCODE, Node.js, Ruby on Rails" />
```

Add `class="awesomplete"` for it to be automatically processed (you can still specify many options via HTML attributes)
Otherwise you can instantiate with a few lines of JS code, which allow for more customization.

There are many ways to link an input to a list of suggestions. 
The simple example above could have also been made with the following markup, which provides a nice native fallback in case the script doesn’t load:

```html
<input class="awesomplete" list="mylist" />
<datalist id="mylist">
	<option>Ada</option>
	<option>Java</option>
	<option>JavaScript</option>
	<option>Brainfuck</option>
	<option>LOLCODE</option>
	<option>Node.js</option>
	<option>Ruby on Rails</option>
</datalist>
```

Or the following, if you don’t want to use a `<datalist>`, or if you don’t want to use IDs (since any selector will work in data-list):

```html
<input class="awesomplete" data-list="#mylist" />
<ul id="mylist">
	<li>Ada</li>
	<li>Java</li>
	<li>JavaScript</li>
	<li>Brainfuck</li>
	<li>LOLCODE</li>
	<li>Node.js</li>
	<li>Ruby on Rails</li>
</ul>
```

There are multiple customizations and properties able to be instantiated within the JS. Libraries and definitions of the properties are available in the Links below.

## License

Awesomplete is released under the MIT License. See [LICENSE][1] file for
details.

## Links

The official site for the library is at <http://leaverou.github.io/awesomplete/>.

Documentation for the API and other topics is at
<http://leaverou.github.io/awesomplete/#api>.

Created by Lea Verou and other fantastic contributors.

[1]: https://github.com/LeaVerou/awesomplete/blob/gh-pages/LICENSE
