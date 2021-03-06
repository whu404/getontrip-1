define([
    'require',
    '../../tool/vector'
], function (require) {
    var vector = require('../../tool/vector');
    return function (points, smooth, isLoop, constraint) {
        var cps = [];
        var v = [];
        var v1 = [];
        var v2 = [];
        var prevPoint;
        var nextPoint;
        var hasConstraint = !!constraint;
        var min, max;
        if (hasConstraint) {
            min = [
                Infinity,
                Infinity
            ];
            max = [
                -Infinity,
                -Infinity
            ];
            for (var i = 0, len = points.length; i < len; i++) {
                vector.min(min, min, points[i]);
                vector.max(max, max, points[i]);
            }
            vector.min(min, min, constraint[0]);
            vector.max(max, max, constraint[1]);
        }
        for (var i = 0, len = points.length; i < len; i++) {
            var point = points[i];
            var prevPoint;
            var nextPoint;
            if (isLoop) {
                prevPoint = points[i ? i - 1 : len - 1];
                nextPoint = points[(i + 1) % len];
            } else {
                if (i === 0 || i === len - 1) {
                    cps.push(points[i]);
                    continue;
                } else {
                    prevPoint = points[i - 1];
                    nextPoint = points[i + 1];
                }
            }
            vector.sub(v, nextPoint, prevPoint);
            vector.scale(v, v, smooth);
            var d0 = vector.distance(point, prevPoint);
            var d1 = vector.distance(point, nextPoint);
            var sum = d0 + d1;
            if (sum !== 0) {
                d0 /= sum;
                d1 /= sum;
            }
            vector.scale(v1, v, -d0);
            vector.scale(v2, v, d1);
            var cp0 = vector.add([], point, v1);
            var cp1 = vector.add([], point, v2);
            if (hasConstraint) {
                vector.max(cp0, cp0, min);
                vector.min(cp0, cp0, max);
                vector.max(cp1, cp1, min);
                vector.min(cp1, cp1, max);
            }
            cps.push(cp0);
            cps.push(cp1);
        }
        if (isLoop) {
            cps.push(cps.shift());
        }
        return cps;
    };
});