"use strict";

var $ = require("../../core/renderer"),
    isDefined = require("./type").isDefined,
    objectUtils = require("./object");

var isEmpty = function(entity) {
    return Array.isArray(entity) && !entity.length;
};

var wrapToArray = function(entity) {
    return Array.isArray(entity) ? entity : [entity];
};

var intersection = function(a, b) {
    if(!Array.isArray(a) || a.length === 0 ||
       !Array.isArray(b) || b.length === 0) {
        return [];
    }

    var result = [];

    $.each(a, function(_, value) {
        var index = inArray(value, b);

        if(index !== -1) {
            result.push(value);
        }
    });

    return result;
};

var removeDuplicates = function(from, what) {
    if(!Array.isArray(from) || from.length === 0) {
        return [];
    }

    if(!Array.isArray(what) || what.length === 0) {
        return from.slice();
    }

    var result = [];

    $.each(from, function(_, value) {
        var index = inArray(value, what);

        if(index === -1) {
            result.push(value);
        }
    });

    return result;
};

var normalizeIndexes = function(items, indexParameterName, currentItem, needIndexCallback) {
    var indexedItems = {},
        parameterIndex = 0;

    $.each(items, function(index, item) {
        index = item[indexParameterName];
        if(isDefined(index)) {
            indexedItems[index] = indexedItems[index] || [];

            if(item === currentItem) {
                indexedItems[index].unshift(item);
            } else {
                indexedItems[index].push(item);
            }
            delete item[indexParameterName];
        }
    });

    objectUtils.orderEach(indexedItems, function(index, items) {
        $.each(items, function() {
            if(index >= 0) {
                this[indexParameterName] = parameterIndex++;
            }
        });
    });

    $.each(items, function() {
        if(!isDefined(this[indexParameterName]) && (!needIndexCallback || needIndexCallback(this))) {
            this[indexParameterName] = parameterIndex++;
        }
    });

    return parameterIndex;
};

var inArray = function(value, object) {
    if(!object) {
        return -1;
    }
    var array = Array.isArray(object) ? object : object.toArray();

    return array.indexOf(value);
};

exports.isEmpty = isEmpty;
exports.wrapToArray = wrapToArray;
exports.intersection = intersection;
exports.removeDuplicates = removeDuplicates;
exports.normalizeIndexes = normalizeIndexes;
exports.inArray = inArray;
