// LOCATION INFORMATION
// This area covers the region near Altamira, Pará, including the Xingu River.
var amazon_basin = ee.Geometry.Polygon(
	[[
		[-79.80, 9.30],
		[-79.80, -23.70],
		[-46.80, -23.70],
		[-46.80, 9.30]
	]]
);

var amazon = ee.FeatureCollection('ft:1eAaerKU7m-J92zjBZO4o6J3Wqwh7mZ1-HUeuAJjE');

// CHANGE NAMES HERE TO RUN EVERYTHING BELOW:
var region = amazon;

// IMAGE COLLECTION INFORMATION
var day =  ee.ImageCollection("MODIS/006/MOD11A1").filterDate('2000-03-05', '2017-11-16')
	.sort('system:time_start', false)
	.filterBounds(region) 
	.select("LST_Day_1km");

var night =  ee.ImageCollection("MODIS/006/MOD11A1").filterDate('2000-03-05', '2017-11-16')
	.sort('system:time_start', false)
	.filterBounds(region) 
	.select("LST_Night_1km");

// CONVERT FROM KELVIN TO DEGREES C
var toCelsius = function(image){
	var time = image.get('system:time_start');
	var celsius = image.multiply(0.02) // Scale factor.
	.subtract(273.15) // Convert from Kelvin to C.
	.rename("celsius")
	.set('system:time_start',time);
	return celsius
};

// GETTING TIME-SERIES INFORMATION
var day_temp = day.map(toCelsius);

var night_temp = night.map(toCelsius);

// TIME SERIES INFO FOR REGION - DAY MEAN
var day_temp_time_mean_region = day_temp.map(function(i) {
	return i.select('celsius').reduceRegions({
		collection: region, 
		reducer: ee.Reducer.mean(), 
		scale: 1000
	}).filter(ee.Filter.neq('mean', null))
	.map(function(f) { 
		return f.set('system:time_start',null);
	});
}).flatten();

Export.table.toDrive({
	collection: day_temp_time_mean_region.select(['.*'],null,false), 
	description: 'modis_day_temp_time_mean_region',
	folder:"/gee-analyses",
	fileFormat: 'CSV'
});

// TIME SERIES INFO FOR REGION - DAY MEDIAN
var day_temp_time_median_region = day_temp.map(function(i) {
	return i.select('celsius').reduceRegions({
		collection: region, 
		reducer: ee.Reducer.median(), 
		scale: 1000
	}).filter(ee.Filter.neq('median', null))
	.map(function(f) { 
		return f.set('system:time_start',null);
	});
}).flatten();

Export.table.toDrive({
	collection: day_temp_time_median_region.select(['.*'],null,false), 
	description: 'modis_day_temp_time_median_region',
	folder:"/gee-analyses",
	fileFormat: 'CSV'
});

// TIME SERIES INFO FOR REGION - DAY STANDARD DEVIATION
var day_temp_time_stdev_region = day_temp.map(function(i) {
	return i.select('celsius').reduceRegions({
		collection: region, 
		reducer: ee.Reducer.stdDev(), 
		scale: 1000
	}).filter(ee.Filter.neq('stdDev', null))
	.map(function(f) { 
		return f.set('system:time_start',null);
	});
}).flatten();

Export.table.toDrive({
	collection: day_temp_time_stdev_region.select(['.*'],null,false), 
	description: 'modis_day_temp_time_stdev_region',
	folder:"/gee-analyses",
	fileFormat: 'CSV'
});

// TIME SERIES INFO FOR REGION - DAY COUNT
var day_temp_time_count_region = day_temp.map(function(i) {
	return i.select('celsius').reduceRegions({
		collection: region, 
		reducer: ee.Reducer.count(), 
		scale: 1000
	}).filter(ee.Filter.neq('count', null))
	.map(function(f) { 
		return f.set('system:time_start',null);
	});
}).flatten();

Export.table.toDrive({
	collection: day_temp_time_count_region.select(['.*'],null,false), 
	description: 'modis_day_temp_time_count_region',
	folder:"/gee-analyses",
	fileFormat: 'CSV'
});

// TIME SERIES INFO FOR REGION - NIGHT MEAN
var night_temp_time_mean_region = night_temp.map(function(i) {
	return i.select('celsius').reduceRegions({
		collection: region, 
		reducer: ee.Reducer.mean(), 
		scale: 1000
	}).filter(ee.Filter.neq('mean', null))
	.map(function(f) { 
		return f.set('system:time_start',null);
	});
}).flatten();

Export.table.toDrive({
	collection: night_temp_time_mean_region.select(['.*'],null,false), 
	description: 'modis_night_temp_time_mean_region',
	folder:"/gee-analyses",
	fileFormat: 'CSV'
});

// TIME SERIES INFO FOR REGION - NIGHT MEDIAN
var night_temp_time_median_region = night_temp.map(function(i) {
	return i.select('celsius').reduceRegions({
		collection: region, 
		reducer: ee.Reducer.median(), 
		scale: 1000
	}).filter(ee.Filter.neq('median', null))
	.map(function(f) { 
		return f.set('system:time_start',null);
	});
}).flatten();

Export.table.toDrive({
	collection: night_temp_time_median_region.select(['.*'],null,false), 
	description: 'modis_night_temp_time_median_region',
	folder:"/gee-analyses",
	fileFormat: 'CSV'
});

// TIME SERIES INFO FOR REGION - NIGHT STANDARD DEVIATION
var night_temp_time_stdev_region = night_temp.map(function(i) {
	return i.select('celsius').reduceRegions({
		collection: region, 
		reducer: ee.Reducer.stdDev(), 
		scale: 1000
	}).filter(ee.Filter.neq('stdDev', null))
	.map(function(f) { 
		return f.set('system:time_start',null);
	});
}).flatten();

Export.table.toDrive({
	collection: night_temp_time_stdev_region.select(['.*'],null,false), 
	description: 'modis_night_temp_time_stdev_region',
	folder:"/gee-analyses",
	fileFormat: 'CSV'
});

// TIME SERIES INFO FOR REGION - NIGHT COUNT
var night_temp_time_count_region = night_temp.map(function(i) {
	return i.select('celsius').reduceRegions({
		collection: region, 
		reducer: ee.Reducer.count(), 
		scale: 1000
	}).filter(ee.Filter.neq('count', null))
	.map(function(f) { 
		return f.set('system:time_start',null);
	});
}).flatten();

Export.table.toDrive({
	collection: night_temp_time_count_region.select(['.*'],null,false), 
	description: 'modis_night_temp_time_count_region',
	folder:"/gee-analyses",
	fileFormat: 'CSV'
});

// GETTING HISTOGRAM INFORMATION - DAY
var day_temp_histogram_region = day_temp.map(function(i) {
	return i.select('celsius').reduceRegions({
		collection: region, 
		reducer: ee.Reducer.histogram(null, 0.25, null),
		scale: 1000
	});
}).flatten();

Export.table.toDrive({
	collection: day_temp_histogram_region, 
	description: 'modis_day_temp_histogram_region',
	folder:"/gee-analyses",
	fileFormat: 'geoJSON'
});

// GETTING HISTOGRAM INFORMATION - NIGHT
var night_temp_histogram_region = night_temp.map(function(i) {
	return i.select('celsius').reduceRegions({
		collection: region, 
		reducer: ee.Reducer.histogram(null, 0.25, null),
		scale: 1000
	});
}).flatten();

Export.table.toDrive({
	collection: night_temp_histogram_region, 
	description: 'modis_night_temp_histogram_region',
	folder:"/gee-analyses",
	fileFormat: 'geoJSON'
});

// OVERALL IMAGE OF THE AMAZON - DAY MEAN
var amazon_day_temp_mean = day_temp.reduce(ee.Reducer.mean());

Export.image.toDrive({
	image: amazon_day_temp_mean.clip(amazon),
	description: 'amazon_modis_day_temp_mean',
	folder:"/gee-analyses",
	scale: 1000,
	region: amazon,
	crs: 'EPSG:3857',
	maxPixels:1e13
});

// OVERALL IMAGE OF THE AMAZON - DAY MEDIAN
var amazon_day_temp_median = day_temp.reduce(ee.Reducer.median());

Export.image.toDrive({
	image: amazon_day_temp_median.clip(amazon),
	description: 'amazon_modis_day_temp_median',
	folder:"/gee-analyses",
	scale: 1000,
	region: amazon,
	crs: 'EPSG:3857',
	maxPixels:1e13
});

// OVERALL IMAGE OF THE AMAZON - DAY STANDARD DEVIATION
var amazon_day_temp_stdev = day_temp.reduce(ee.Reducer.stdDev());

Export.image.toDrive({
	image: amazon_day_temp_stdev.clip(amazon),
	description: 'amazon_modis_day_temp_stdev',
	folder:"/gee-analyses",
	scale: 1000,
	region: amazon,
	crs: 'EPSG:3857',
	maxPixels:1e13
});

// OVERALL IMAGE OF THE AMAZON - NIGHT MEAN
var amazon_night_temp_mean = night_temp.reduce(ee.Reducer.mean());

Export.image.toDrive({
	image: amazon_night_temp_mean.clip(amazon),
	description: 'amazon_modis_night_temp_mean',
	folder:"/gee-analyses",
	scale: 1000,
	region: amazon,
	crs: 'EPSG:3857',
	maxPixels:1e13
});

// OVERALL IMAGE OF THE AMAZON - NIGHT MEDIAN
var amazon_night_temp_median = night_temp.reduce(ee.Reducer.median());

Export.image.toDrive({
	image: amazon_night_temp_median.clip(amazon),
	description: 'amazon_modis_night_temp_median',
	folder:"/gee-analyses",
	scale: 1000,
	region: amazon,
	crs: 'EPSG:3857',
	maxPixels:1e13
});

// OVERALL IMAGE OF THE AMAZON - NIGHT STANDARD DEVIATION
var amazon_night_temp_stdev = night_temp.reduce(ee.Reducer.stdDev());

Export.image.toDrive({
	image: amazon_night_temp_stdev.clip(amazon),
	description: 'amazon_modis_night_temp_stdev',
	folder:"/gee-analyses",
	scale: 1000,
	region: amazon,
	crs: 'EPSG:3857',
	maxPixels:1e13
});

// ITERATING OVER IMAGECOLLECTION TO GET IMAGE ANOMALIES (MOVING AVERAGE?)
// ITERATING OVER IMAGECOLLECTION - DAY
var day_1_median = day_temp.filterDate('2000-03-05', '2009-12-31').median();
var day_2_median = day_temp.filterDate('2010-01-01', '2017-11-16').median();

var amazon_day_temp_diff2_1 = day_2_median.subtract(day_1_median);

Export.image.toDrive({
	image: amazon_day_temp_diff2_1.clip(amazon),
	description: 'amazon_modis_day_temp_diff2_1',
	folder:"/gee-analyses",
	scale: 1000,
	region: amazon,
	crs: 'EPSG:3857',
	maxPixels:1e13
});

// ITERATING OVER IMAGECOLLECTION - NIGHT
var night_1_median = night_temp.filterDate('2000-03-05', '2008-12-31').median();
var night_2_median = night_temp.filterDate('2009-01-01', '2017-11-16').median();

var amazon_night_temp_diff2_1 = night_2_median.subtract(night_1_median);

Export.image.toDrive({
	image: amazon_night_temp_diff2_1.clip(amazon),
	description: 'amazon_modis_night_temp_diff2_1',
	folder:"/gee-analyses",
	scale: 1000,
	region: amazon,
	crs: 'EPSG:3857',
	maxPixels:1e13
});