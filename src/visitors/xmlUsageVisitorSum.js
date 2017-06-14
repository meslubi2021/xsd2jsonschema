"use strict";

var BaseConvertionVisitor = require("./baseConversionVisitor");

var uris_NAME = Symbol();
var tagCounts_NAME = Symbol();

/**
 * Class representing a custom visitor.  This visitor counts the XML Schema elments used by the provided
 * {@link XsdFile|XML Schema} files and displays aggregate counts of elements used accross all scheam files.
 */
class XmlUsageVisitorSum extends BaseConvertionVisitor {
	/**
	 * Constructs an instance of XmlUsageVisitor without a converter because all processing will be done here in the
	 * visitor.  Notice {@link BaseConversionVisitor#visit|BaseConversionVisitor.visit()} is overridden.
	 * 
	 * @constructor
	 */
	constructor() {
		super(undefined);
		this.uris = {};
		this.tagCounts = {};
	}

	get uris() {
		return this[uris_NAME];
	}

	set uris(newUris) {
		this[uris_NAME] = newUris;
	}

	get tagCounts() {
		return this[tagCounts_NAME];
	}

	set tagCounts(newTagCounts) {
		this[tagCounts_NAME] = newTagCounts;
	}


	addSchema(uri) {
		if (this.uris[uri] === undefined) {
			this.uris[uri] = { tagCounts: {} }
		}
	}

	addTag(xmlTag) {
		if (this.tagCounts[xmlTag] === undefined) {
			this.tagCounts[xmlTag] = 1;
		} else {
			this.tagCounts[xmlTag] += 1;
		}
	}

	visit(node, jsonSchema, xsd) {
		var uri = xsd.uri;
		this.addSchema(uri);
		this.addTag(node.name());
		return true;
	}

	onBegin(jsonSchema, xsd) {
		if (this.uris[xsd.uri] === undefined) {
			return true;
		} else {
			return false;
		}
	}

	dump() {
		console.log("----------------------------");
		console.log("Overall XML Schema Tag Usage");
		console.log("----------------------------");
		console.log(Object.keys(this.uris));
		console.log("----------------------------");
		Object.keys(this.tagCounts).sort().forEach(function (xmlTag, index, array) {
			console.log(xmlTag + " = " + this.tagCounts[xmlTag]);
		}, this)
		console.log();
	}
}

module.exports = XmlUsageVisitorSum;
