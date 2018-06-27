// Areas of study.
var altamira = ee.Geometry.Polygon(
	[[
		[-52.89, -3.00],
		[-52.89, -3.75],
		[-52.14, -3.75],
		[-52.14, -3.00]
	]]
);

var caroebe = ee.Geometry.Polygon(
	[[
		[-60.35, 0.50],
		[-60.35, -0.25],
		[-59.60, -0.25],
		[-59.60, 0.50]
	]]
);

var igarape = ee.Geometry.Polygon(
	[[
		[-47.85, -1.00],
		[-47.85, -1.75],
		[-47.10, -1.75],
		[-47.10, -1.00]
	]]
);

var labrea = ee.Geometry.Polygon(
	[[
		[-65.47, -7.20],
		[-65.47, -7.95],
		[-64.72, -7.95],
		[-64.72, -7.20]
	]]
);

var lucas = ee.Geometry.Polygon(
	[[
		[-56.13, -12.98],
		[-56.13, -13.73],
		[-55.38, -13.73],
		[-55.38, -12.98]
	]]
);

var machadinho = ee.Geometry.Polygon(
	[[
		[-62.45, -9.24],
		[-62.45, -9.99],
		[-61.70, -9.99],
		[-61.70, -9.24]
	]]
);

var manaus = ee.Geometry.Polygon(
	[[
		[-60.43, -2.75],
		[-60.43, -3.50],
		[-59.68, -3.50],
		[-59.68, -2.75]
	]]
);

var tamshiyacu = ee.Geometry.Polygon(
	[[
		[-73.35, -3.94],
		[-73.35, -4.69],
		[-72.60, -4.69],
		[-72.60, -3.94]
	]]
);

var amazon_basin = ee.Geometry.Polygon(
	[[
		[-79.80, 9.30],
		[-79.80, -23.70],
		[-46.80, -23.70],
		[-46.80, 9.30]
	]]
);
var amazon = ee.FeatureCollection('ft:1eAaerKU7m-J92zjBZO4o6J3Wqwh7mZ1-HUeuAJjE');

// CHANGE THIS TO SET DIFFERENT LOCATIONS.
var region = tamshiyacu;

// To calculate NDVI to the image set.
var addNDVI = function(image) {
	return image.addBands(image.normalizedDifference(['B5', 'B4']).rename('NDVI'));
};

// To mask out clouds; currently set at 30%.
var cloudMask = function(image) {
	var clouds = ee.Algorithms.Landsat.simpleCloudScore(image).select(['cloud']);
	return image.updateMask(clouds.lte(30));
};

var l7 = ee.ImageCollection('LANDSAT/LE07/C01/T1_RT_TOA')
	.filterBounds(region)
    .filterDate('1999-01-01', '2017-11-10')
    .map(addNDVI)
    .map(cloudMask);

var l7_2 = l7.select(['B6_VCID_1', 'NDVI']);

var toCelsius2_l7 = function(image){
	var time = image.get('system:time_start');
	var celsius = image.expression('(B6/(1+(10.8*B6/14388)*log((0.004*((ndvi-0.2)/0.3)+0.986))))-273',{'ndvi': image.select('NDVI'), 'B6': image.select('B6_VCID_1')})
	.rename("celsius")
	.set('system:time_start',time);
	return celsius;
};

var l7_2_2 = l7_2.map(toCelsius2_l7);

// To get time-series mean temperature for the region.
var l7_2_2_time_mean_region = l7_2_2.map(function(i) {
	return i.select('celsius').reduceRegions({
		collection: region, 
		reducer: ee.Reducer.mean(), 
		scale: 60
	}).filter(ee.Filter.neq('mean', null))
	.map(function(f) { 
		return f.set('system:time_start',null);
	});
}).flatten();

Export.table.toDrive({
	collection: l7_2_2_time_mean_region.select(['.*'],null,false), 
	description: 'l7_2_2_time_mean_region',
	folder:"/gee-analyses",
	fileFormat: 'CSV'
});

// To get time-series median temperature for the region.
var l7_2_2_time_median_region = l7_2_2.map(function(i) {
	return i.select('celsius').reduceRegions({
		collection: region, 
		reducer: ee.Reducer.median(), 
		scale: 60
	}).filter(ee.Filter.neq('median', null))
	.map(function(f) { 
		return f.set('system:time_start',null);
	});
}).flatten();

Export.table.toDrive({
	collection: l7_2_2_time_median_region.select(['.*'],null,false), 
	description: 'l7_2_2_time_median_region',
	folder:"/gee-analyses",
	fileFormat: 'CSV'
});

// To get time-series standard deviation of temperature for the region.
var l7_2_2_time_stdev_region = l7_2_2.map(function(i) {
	return i.select('celsius').reduceRegions({
		collection: region, 
		reducer: ee.Reducer.stdDev(), 
		scale: 60
	}).filter(ee.Filter.neq('stdDev', null))
	.map(function(f) { 
		return f.set('system:time_start',null);
	});
}).flatten();

Export.table.toDrive({
	collection: l7_2_2_time_stdev_region.select(['.*'],null,false), 
	description: 'l7_2_2_time_stdev_region',
	folder:"/gee-analyses",
	fileFormat: 'CSV'
});

// To get time-series pixel count for the region.
var l7_2_2_time_count_region = l7_2_2.map(function(i) {
	return i.select('celsius').reduceRegions({
		collection: region, 
		reducer: ee.Reducer.count(), 
		scale: 60
	}).filter(ee.Filter.neq('count', null))
	.map(function(f) { 
		return f.set('system:time_start',null);
	});
}).flatten();

Export.table.toDrive({
	collection: l7_2_2_time_count_region.select(['.*'],null,false), 
	description: 'l7_2_2_time_count_region',
	folder:"/gee-analyses",
	fileFormat: 'CSV'
});

// To calculate pixel histogram for the region.
var l7_2_2_time_hist_region = l7_2_2.map(function(i) {
	return i.select('celsius').reduceRegions({
		collection: region, 
		reducer: ee.Reducer.histogram(null, 0.25, null),
		scale: 60
	});
}).flatten();

Export.table.toDrive({
	collection: l7_2_2_time_hist_region, 
	description: 'l7_2_2_time_hist_region',
	folder:"/gee-analyses",
	fileFormat: 'geoJSON'
});

// To get an image showing mean temperature for the region.
var l7_2_2_mean_region_image = l7_2_2.reduce(ee.Reducer.mean());

Export.image.toDrive({
	image: l7_2_2_mean_region_image.clip(region),
	description: 'l7_2_2_mean_region_image',
	folder:"/gee-analyses",
	scale: 60,
	region: region,
	crs: 'EPSG:3857',
	maxPixels:1e13
});

// To get an image showing median temperature for the region.
var l7_2_2_median_region_image = l7_2_2.reduce(ee.Reducer.median());

Export.image.toDrive({
	image: l7_2_2_median_region_image.clip(region),
	description: 'l7_2_2_median_region_image',
	folder:"/gee-analyses",
	scale: 60,
	region: region,
	crs: 'EPSG:3857',
	maxPixels:1e13
});

// To get an image showing standard deviation of temperature for the region.
var l7_2_2_stdev_region_image = l7_2_2.reduce(ee.Reducer.stdDev());

Export.image.toDrive({
	image: l7_2_2_stdev_region_image.clip(region),
	description: 'l7_2_2_stdev_region_image',
	folder:"/gee-analyses",
	scale: 60,
	region: region,
	crs: 'EPSG:3857',
	maxPixels:1e13
});

// To generate an image showing differences in temperature between time periods.
var l7_2_2_series1_mean = l7_2_2.filterDate('2000-01-01', '2009-12-31').mean();
var l7_2_2_series2_mean = l7_2_2.filterDate('2010-01-01', '2017-11-10').mean();

var l7_2_2_diff2_1 = l7_2_2_series2_mean.subtract(l7_2_2_series1_mean);

Export.image.toDrive({
	image: l7_2_2_diff2_1.clip(region),
	description: 'l7_2_2_diff2_1_region',
	folder:"/gee-analyses",
	scale: 60,
	region: region,
	crs: 'EPSG:3857',
	maxPixels:1e13
});
