{
	"patcher" : 	{
		"fileversion" : 1,
		"appversion" : 		{
			"major" : 8,
			"minor" : 1,
			"revision" : 10,
			"architecture" : "x64",
			"modernui" : 1
		}
,
		"classnamespace" : "box",
		"rect" : [ 670.0, 83.0, 1189.0, 937.0 ],
		"bglocked" : 0,
		"openinpresentation" : 0,
		"default_fontsize" : 12.0,
		"default_fontface" : 0,
		"default_fontname" : "Arial",
		"gridonopen" : 1,
		"gridsize" : [ 15.0, 15.0 ],
		"gridsnaponopen" : 1,
		"objectsnaponopen" : 1,
		"statusbarvisible" : 2,
		"toolbarvisible" : 1,
		"lefttoolbarpinned" : 0,
		"toptoolbarpinned" : 0,
		"righttoolbarpinned" : 0,
		"bottomtoolbarpinned" : 0,
		"toolbars_unpinned_last_save" : 0,
		"tallnewobj" : 0,
		"boxanimatetime" : 200,
		"enablehscroll" : 1,
		"enablevscroll" : 1,
		"devicewidth" : 0.0,
		"description" : "",
		"digest" : "",
		"tags" : "",
		"style" : "",
		"subpatcher_template" : "",
		"assistshowspatchername" : 0,
		"boxes" : [ 			{
				"box" : 				{
					"fontface" : 0,
					"fontsize" : 12.0,
					"id" : "obj-14",
					"linecount" : 8,
					"maxclass" : "o.compose",
					"numinlets" : 2,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 85.0, 657.0, 237.0, 119.0 ],
					"presentation_linecount" : 8,
					"saved_bundle_data" : [ 35, 98, 117, 110, 100, 108, 101, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -92, 47, 118, 97, 108, 0, 0, 0, 0, 44, 46, 0, 0, 0, 0, 0, -108, 35, 98, 117, 110, 100, 108, 101, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20, 47, 105, 100, 0, 44, 115, 0, 0, 112, 111, 105, 110, 116, 45, 49, 49, 0, 0, 0, 0, 0, 0, 0, 24, 47, 99, 108, 97, 115, 115, 0, 0, 44, 115, 0, 0, 68, 97, 116, 97, 80, 111, 105, 110, 116, 0, 0, 0, 0, 0, 0, 24, 47, 99, 111, 110, 116, 97, 105, 110, 101, 114, 0, 0, 44, 115, 0, 0, 112, 108, 111, 116, 0, 0, 0, 0, 0, 0, 0, 24, 47, 99, 101, 110, 116, 114, 111, 105, 100, 0, 0, 0, 44, 100, 0, 0, 63, -17, -1, -1, -1, -1, -1, -1, 0, 0, 0, 20, 47, 115, 112, 114, 101, 97, 100, 0, 44, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20, 47, 107, 101, 121, 0, 0, 0, 0, 44, 115, 0, 0, 100, 97, 116, 97, 0, 0, 0, 0 ],
					"saved_bundle_length" : 208,
					"text" : "/val : {\n\t/id : \"point-11\",\n\t/class : \"DataPoint\",\n\t/container : \"plot\",\n\t/centroid : 1,\n\t/spread : 0.\n},\n/key : \"data\""
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-12",
					"maxclass" : "newobj",
					"numinlets" : 1,
					"numoutlets" : 2,
					"outlettype" : [ "", "FullPacket" ],
					"patching_rect" : [ 153.0, 400.0, 113.0, 22.0 ],
					"text" : "o.route /value"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-9",
					"maxclass" : "newobj",
					"numinlets" : 1,
					"numoutlets" : 2,
					"outlettype" : [ "", "" ],
					"patching_rect" : [ 153.0, 353.0, 113.0, 22.0 ],
					"text" : "o.listenumerate /pts"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-8",
					"maxclass" : "newobj",
					"numinlets" : 2,
					"numoutlets" : 1,
					"outlettype" : [ "FullPacket" ],
					"patching_rect" : [ 153.0, 447.0, 118.0, 22.0 ],
					"text" : "o.pack /val /key data"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-76",
					"maxclass" : "newobj",
					"numinlets" : 1,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patcher" : 					{
						"fileversion" : 1,
						"appversion" : 						{
							"major" : 8,
							"minor" : 1,
							"revision" : 10,
							"architecture" : "x64",
							"modernui" : 1
						}
,
						"classnamespace" : "box",
						"rect" : [ 59.0, 104.0, 640.0, 480.0 ],
						"bglocked" : 0,
						"openinpresentation" : 0,
						"default_fontsize" : 12.0,
						"default_fontface" : 0,
						"default_fontname" : "Arial",
						"gridonopen" : 1,
						"gridsize" : [ 15.0, 15.0 ],
						"gridsnaponopen" : 1,
						"objectsnaponopen" : 1,
						"statusbarvisible" : 2,
						"toolbarvisible" : 1,
						"lefttoolbarpinned" : 0,
						"toptoolbarpinned" : 0,
						"righttoolbarpinned" : 0,
						"bottomtoolbarpinned" : 0,
						"toolbars_unpinned_last_save" : 0,
						"tallnewobj" : 0,
						"boxanimatetime" : 200,
						"enablehscroll" : 1,
						"enablevscroll" : 1,
						"devicewidth" : 0.0,
						"description" : "",
						"digest" : "",
						"tags" : "",
						"style" : "",
						"subpatcher_template" : "",
						"assistshowspatchername" : 0,
						"boxes" : [ 							{
								"box" : 								{
									"id" : "obj-8",
									"maxclass" : "newobj",
									"numinlets" : 1,
									"numoutlets" : 1,
									"outlettype" : [ "" ],
									"patching_rect" : [ 50.0, 130.0, 133.0, 22.0 ],
									"text" : "udpreceive 7777 cnmat"
								}

							}
, 							{
								"box" : 								{
									"id" : "obj-1",
									"maxclass" : "newobj",
									"numinlets" : 1,
									"numoutlets" : 0,
									"patching_rect" : [ 50.0, 100.0, 145.0, 22.0 ],
									"text" : "udpsend localhost 8888"
								}

							}
, 							{
								"box" : 								{
									"id" : "obj-64",
									"maxclass" : "message",
									"numinlets" : 2,
									"numoutlets" : 1,
									"outlettype" : [ "" ],
									"patching_rect" : [ 197.0, 106.0, 103.0, 22.0 ],
									"text" : "maxqueuesize 0"
								}

							}
, 							{
								"box" : 								{
									"comment" : "",
									"id" : "obj-74",
									"index" : 1,
									"maxclass" : "inlet",
									"numinlets" : 0,
									"numoutlets" : 1,
									"outlettype" : [ "FullPacket" ],
									"patching_rect" : [ 50.0, 40.0, 30.0, 30.0 ]
								}

							}
, 							{
								"box" : 								{
									"comment" : "",
									"id" : "obj-75",
									"index" : 1,
									"maxclass" : "outlet",
									"numinlets" : 1,
									"numoutlets" : 0,
									"patching_rect" : [ 50.0, 212.0, 30.0, 30.0 ]
								}

							}
 ],
						"lines" : [ 							{
								"patchline" : 								{
									"destination" : [ "obj-8", 0 ],
									"source" : [ "obj-64", 0 ]
								}

							}
, 							{
								"patchline" : 								{
									"destination" : [ "obj-1", 0 ],
									"source" : [ "obj-74", 0 ]
								}

							}
, 							{
								"patchline" : 								{
									"destination" : [ "obj-75", 0 ],
									"source" : [ "obj-8", 0 ]
								}

							}
 ]
					}
,
					"patching_rect" : [ 153.0, 557.0, 81.0, 22.0 ],
					"saved_object_attributes" : 					{
						"description" : "",
						"digest" : "",
						"globalpatchername" : "",
						"tags" : ""
					}
,
					"text" : "p symbolist io"
				}

			}
, 			{
				"box" : 				{
					"fontface" : 0,
					"fontsize" : 12.0,
					"id" : "obj-6",
					"linecount" : 69,
					"maxclass" : "o.compose",
					"numinlets" : 2,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 418.0, 477.0, 546.0, 948.0 ],
					"presentation_linecount" : 69,
					"saved_bundle_data" : [ 35, 98, 117, 110, 100, 108, 101, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 116, 47, 99, 101, 110, 116, 114, 111, 105, 100, 0, 0, 0, 44, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 63, -71, -103, -103, -103, -103, -103, -102, 63, -55, -103, -103, -103, -103, -103, -102, 63, -45, 51, 51, 51, 51, 51, 52, 63, -39, -103, -103, -103, -103, -103, -102, 63, -32, 0, 0, 0, 0, 0, 0, 63, -29, 51, 51, 51, 51, 51, 51, 63, -26, 102, 102, 102, 102, 102, 102, 63, -23, -103, -103, -103, -103, -103, -103, 63, -20, -52, -52, -52, -52, -52, -52, 63, -17, -1, -1, -1, -1, -1, -1, 0, 0, 0, 112, 47, 115, 112, 114, 101, 97, 100, 0, 44, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 0, 0, 0, 0, 63, -17, -1, -1, -1, -1, -1, -1, 63, -20, -52, -52, -52, -52, -52, -52, 63, -23, -103, -103, -103, -103, -103, -103, 63, -26, 102, 102, 102, 102, 102, 102, 63, -29, 51, 51, 51, 51, 51, 51, 63, -32, 0, 0, 0, 0, 0, 0, 63, -39, -103, -103, -103, -103, -103, -102, 63, -45, 51, 51, 51, 51, 51, 52, 63, -55, -103, -103, -103, -103, -103, -102, 63, -71, -103, -103, -103, -103, -103, -102, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 124, 47, 112, 116, 115, 0, 0, 0, 0, 44, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 0, 0, 0, 0, 0, 0, 0, -112, 35, 98, 117, 110, 100, 108, 101, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16, 47, 105, 100, 0, 44, 115, 0, 0, 112, 111, 105, 110, 116, 45, 49, 0, 0, 0, 0, 24, 47, 99, 108, 97, 115, 115, 0, 0, 44, 115, 0, 0, 68, 97, 116, 97, 80, 111, 105, 110, 116, 0, 0, 0, 0, 0, 0, 24, 47, 99, 111, 110, 116, 97, 105, 110, 101, 114, 0, 0, 44, 115, 0, 0, 112, 108, 111, 116, 0, 0, 0, 0, 0, 0, 0, 24, 47, 99, 101, 110, 116, 114, 111, 105, 100, 0, 0, 0, 44, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20, 47, 115, 112, 114, 101, 97, 100, 0, 44, 100, 0, 0, 63, -17, -1, -1, -1, -1, -1, -1, 0, 0, 0, -112, 35, 98, 117, 110, 100, 108, 101, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16, 47, 105, 100, 0, 44, 115, 0, 0, 112, 111, 105, 110, 116, 45, 50, 0, 0, 0, 0, 24, 47, 99, 108, 97, 115, 115, 0, 0, 44, 115, 0, 0, 68, 97, 116, 97, 80, 111, 105, 110, 116, 0, 0, 0, 0, 0, 0, 24, 47, 99, 111, 110, 116, 97, 105, 110, 101, 114, 0, 0, 44, 115, 0, 0, 112, 108, 111, 116, 0, 0, 0, 0, 0, 0, 0, 24, 47, 99, 101, 110, 116, 114, 111, 105, 100, 0, 0, 0, 44, 100, 0, 0, 63, -71, -103, -103, -103, -103, -103, -102, 0, 0, 0, 20, 47, 115, 112, 114, 101, 97, 100, 0, 44, 100, 0, 0, 63, -20, -52, -52, -52, -52, -52, -52, 0, 0, 0, -112, 35, 98, 117, 110, 100, 108, 101, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16, 47, 105, 100, 0, 44, 115, 0, 0, 112, 111, 105, 110, 116, 45, 51, 0, 0, 0, 0, 24, 47, 99, 108, 97, 115, 115, 0, 0, 44, 115, 0, 0, 68, 97, 116, 97, 80, 111, 105, 110, 116, 0, 0, 0, 0, 0, 0, 24, 47, 99, 111, 110, 116, 97, 105, 110, 101, 114, 0, 0, 44, 115, 0, 0, 112, 108, 111, 116, 0, 0, 0, 0, 0, 0, 0, 24, 47, 99, 101, 110, 116, 114, 111, 105, 100, 0, 0, 0, 44, 100, 0, 0, 63, -55, -103, -103, -103, -103, -103, -102, 0, 0, 0, 20, 47, 115, 112, 114, 101, 97, 100, 0, 44, 100, 0, 0, 63, -23, -103, -103, -103, -103, -103, -103, 0, 0, 0, -112, 35, 98, 117, 110, 100, 108, 101, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16, 47, 105, 100, 0, 44, 115, 0, 0, 112, 111, 105, 110, 116, 45, 52, 0, 0, 0, 0, 24, 47, 99, 108, 97, 115, 115, 0, 0, 44, 115, 0, 0, 68, 97, 116, 97, 80, 111, 105, 110, 116, 0, 0, 0, 0, 0, 0, 24, 47, 99, 111, 110, 116, 97, 105, 110, 101, 114, 0, 0, 44, 115, 0, 0, 112, 108, 111, 116, 0, 0, 0, 0, 0, 0, 0, 24, 47, 99, 101, 110, 116, 114, 111, 105, 100, 0, 0, 0, 44, 100, 0, 0, 63, -45, 51, 51, 51, 51, 51, 52, 0, 0, 0, 20, 47, 115, 112, 114, 101, 97, 100, 0, 44, 100, 0, 0, 63, -26, 102, 102, 102, 102, 102, 102, 0, 0, 0, -112, 35, 98, 117, 110, 100, 108, 101, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16, 47, 105, 100, 0, 44, 115, 0, 0, 112, 111, 105, 110, 116, 45, 53, 0, 0, 0, 0, 24, 47, 99, 108, 97, 115, 115, 0, 0, 44, 115, 0, 0, 68, 97, 116, 97, 80, 111, 105, 110, 116, 0, 0, 0, 0, 0, 0, 24, 47, 99, 111, 110, 116, 97, 105, 110, 101, 114, 0, 0, 44, 115, 0, 0, 112, 108, 111, 116, 0, 0, 0, 0, 0, 0, 0, 24, 47, 99, 101, 110, 116, 114, 111, 105, 100, 0, 0, 0, 44, 100, 0, 0, 63, -39, -103, -103, -103, -103, -103, -102, 0, 0, 0, 20, 47, 115, 112, 114, 101, 97, 100, 0, 44, 100, 0, 0, 63, -29, 51, 51, 51, 51, 51, 51, 0, 0, 0, -112, 35, 98, 117, 110, 100, 108, 101, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16, 47, 105, 100, 0, 44, 115, 0, 0, 112, 111, 105, 110, 116, 45, 54, 0, 0, 0, 0, 24, 47, 99, 108, 97, 115, 115, 0, 0, 44, 115, 0, 0, 68, 97, 116, 97, 80, 111, 105, 110, 116, 0, 0, 0, 0, 0, 0, 24, 47, 99, 111, 110, 116, 97, 105, 110, 101, 114, 0, 0, 44, 115, 0, 0, 112, 108, 111, 116, 0, 0, 0, 0, 0, 0, 0, 24, 47, 99, 101, 110, 116, 114, 111, 105, 100, 0, 0, 0, 44, 100, 0, 0, 63, -32, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20, 47, 115, 112, 114, 101, 97, 100, 0, 44, 100, 0, 0, 63, -32, 0, 0, 0, 0, 0, 0, 0, 0, 0, -112, 35, 98, 117, 110, 100, 108, 101, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16, 47, 105, 100, 0, 44, 115, 0, 0, 112, 111, 105, 110, 116, 45, 55, 0, 0, 0, 0, 24, 47, 99, 108, 97, 115, 115, 0, 0, 44, 115, 0, 0, 68, 97, 116, 97, 80, 111, 105, 110, 116, 0, 0, 0, 0, 0, 0, 24, 47, 99, 111, 110, 116, 97, 105, 110, 101, 114, 0, 0, 44, 115, 0, 0, 112, 108, 111, 116, 0, 0, 0, 0, 0, 0, 0, 24, 47, 99, 101, 110, 116, 114, 111, 105, 100, 0, 0, 0, 44, 100, 0, 0, 63, -29, 51, 51, 51, 51, 51, 51, 0, 0, 0, 20, 47, 115, 112, 114, 101, 97, 100, 0, 44, 100, 0, 0, 63, -39, -103, -103, -103, -103, -103, -102, 0, 0, 0, -112, 35, 98, 117, 110, 100, 108, 101, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16, 47, 105, 100, 0, 44, 115, 0, 0, 112, 111, 105, 110, 116, 45, 56, 0, 0, 0, 0, 24, 47, 99, 108, 97, 115, 115, 0, 0, 44, 115, 0, 0, 68, 97, 116, 97, 80, 111, 105, 110, 116, 0, 0, 0, 0, 0, 0, 24, 47, 99, 111, 110, 116, 97, 105, 110, 101, 114, 0, 0, 44, 115, 0, 0, 112, 108, 111, 116, 0, 0, 0, 0, 0, 0, 0, 24, 47, 99, 101, 110, 116, 114, 111, 105, 100, 0, 0, 0, 44, 100, 0, 0, 63, -26, 102, 102, 102, 102, 102, 102, 0, 0, 0, 20, 47, 115, 112, 114, 101, 97, 100, 0, 44, 100, 0, 0, 63, -45, 51, 51, 51, 51, 51, 52, 0, 0, 0, -112, 35, 98, 117, 110, 100, 108, 101, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16, 47, 105, 100, 0, 44, 115, 0, 0, 112, 111, 105, 110, 116, 45, 57, 0, 0, 0, 0, 24, 47, 99, 108, 97, 115, 115, 0, 0, 44, 115, 0, 0, 68, 97, 116, 97, 80, 111, 105, 110, 116, 0, 0, 0, 0, 0, 0, 24, 47, 99, 111, 110, 116, 97, 105, 110, 101, 114, 0, 0, 44, 115, 0, 0, 112, 108, 111, 116, 0, 0, 0, 0, 0, 0, 0, 24, 47, 99, 101, 110, 116, 114, 111, 105, 100, 0, 0, 0, 44, 100, 0, 0, 63, -23, -103, -103, -103, -103, -103, -103, 0, 0, 0, 20, 47, 115, 112, 114, 101, 97, 100, 0, 44, 100, 0, 0, 63, -55, -103, -103, -103, -103, -103, -102, 0, 0, 0, -108, 35, 98, 117, 110, 100, 108, 101, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20, 47, 105, 100, 0, 44, 115, 0, 0, 112, 111, 105, 110, 116, 45, 49, 48, 0, 0, 0, 0, 0, 0, 0, 24, 47, 99, 108, 97, 115, 115, 0, 0, 44, 115, 0, 0, 68, 97, 116, 97, 80, 111, 105, 110, 116, 0, 0, 0, 0, 0, 0, 24, 47, 99, 111, 110, 116, 97, 105, 110, 101, 114, 0, 0, 44, 115, 0, 0, 112, 108, 111, 116, 0, 0, 0, 0, 0, 0, 0, 24, 47, 99, 101, 110, 116, 114, 111, 105, 100, 0, 0, 0, 44, 100, 0, 0, 63, -20, -52, -52, -52, -52, -52, -52, 0, 0, 0, 20, 47, 115, 112, 114, 101, 97, 100, 0, 44, 100, 0, 0, 63, -71, -103, -103, -103, -103, -103, -102, 0, 0, 0, -108, 35, 98, 117, 110, 100, 108, 101, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20, 47, 105, 100, 0, 44, 115, 0, 0, 112, 111, 105, 110, 116, 45, 49, 49, 0, 0, 0, 0, 0, 0, 0, 24, 47, 99, 108, 97, 115, 115, 0, 0, 44, 115, 0, 0, 68, 97, 116, 97, 80, 111, 105, 110, 116, 0, 0, 0, 0, 0, 0, 24, 47, 99, 111, 110, 116, 97, 105, 110, 101, 114, 0, 0, 44, 115, 0, 0, 112, 108, 111, 116, 0, 0, 0, 0, 0, 0, 0, 24, 47, 99, 101, 110, 116, 114, 111, 105, 100, 0, 0, 0, 44, 100, 0, 0, 63, -17, -1, -1, -1, -1, -1, -1, 0, 0, 0, 20, 47, 115, 112, 114, 101, 97, 100, 0, 44, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
					"saved_bundle_length" : 1916,
					"text" : "/centroid : [0., 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],\n/spread : [1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0.],\n/pts : [{\n\t/id : \"point-1\",\n\t/class : \"DataPoint\",\n\t/container : \"plot\",\n\t/centroid : 0.,\n\t/spread : 1\n}, {\n\t/id : \"point-2\",\n\t/class : \"DataPoint\",\n\t/container : \"plot\",\n\t/centroid : 0.1,\n\t/spread : 0.9\n}, {\n\t/id : \"point-3\",\n\t/class : \"DataPoint\",\n\t/container : \"plot\",\n\t/centroid : 0.2,\n\t/spread : 0.8\n}, {\n\t/id : \"point-4\",\n\t/class : \"DataPoint\",\n\t/container : \"plot\",\n\t/centroid : 0.3,\n\t/spread : 0.7\n}, {\n\t/id : \"point-5\",\n\t/class : \"DataPoint\",\n\t/container : \"plot\",\n\t/centroid : 0.4,\n\t/spread : 0.6\n}, {\n\t/id : \"point-6\",\n\t/class : \"DataPoint\",\n\t/container : \"plot\",\n\t/centroid : 0.5,\n\t/spread : 0.5\n}, {\n\t/id : \"point-7\",\n\t/class : \"DataPoint\",\n\t/container : \"plot\",\n\t/centroid : 0.6,\n\t/spread : 0.4\n}, {\n\t/id : \"point-8\",\n\t/class : \"DataPoint\",\n\t/container : \"plot\",\n\t/centroid : 0.7,\n\t/spread : 0.3\n}, {\n\t/id : \"point-9\",\n\t/class : \"DataPoint\",\n\t/container : \"plot\",\n\t/centroid : 0.8,\n\t/spread : 0.2\n}, {\n\t/id : \"point-10\",\n\t/class : \"DataPoint\",\n\t/container : \"plot\",\n\t/centroid : 0.9,\n\t/spread : 0.1\n}, {\n\t/id : \"point-11\",\n\t/class : \"DataPoint\",\n\t/container : \"plot\",\n\t/centroid : 1,\n\t/spread : 0.\n}]"
				}

			}
, 			{
				"box" : 				{
					"fontface" : 0,
					"fontsize" : 12.0,
					"id" : "obj-3",
					"linecount" : 12,
					"maxclass" : "o.expr.codebox",
					"numinlets" : 2,
					"numoutlets" : 3,
					"outlettype" : [ "FullPacket", "FullPacket", "FullPacket" ],
					"patching_rect" : [ 395.0, 253.0, 378.0, 195.0 ],
					"presentation_linecount" : 14,
					"text" : "\n/pts = map( \n  lambda([i, c, s],\n    {\n      /id : \"point-\" + i,\n      /class : \"DataPoint\",\n      /container : \"plot\",\n      /centroid : c,\n      /spread : s\n    }\n  ), aseq(1, length(/centroid)), /centroid, /spread\n)\n"
				}

			}
, 			{
				"box" : 				{
					"fontface" : 0,
					"fontsize" : 12.0,
					"id" : "obj-2",
					"linecount" : 2,
					"maxclass" : "o.compose",
					"numinlets" : 2,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 478.0, 210.0, 546.0, 38.0 ],
					"saved_bundle_data" : [ 35, 98, 117, 110, 100, 108, 101, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 116, 47, 99, 101, 110, 116, 114, 111, 105, 100, 0, 0, 0, 44, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 63, -71, -103, -103, -103, -103, -103, -102, 63, -55, -103, -103, -103, -103, -103, -102, 63, -45, 51, 51, 51, 51, 51, 52, 63, -39, -103, -103, -103, -103, -103, -102, 63, -32, 0, 0, 0, 0, 0, 0, 63, -29, 51, 51, 51, 51, 51, 51, 63, -26, 102, 102, 102, 102, 102, 102, 63, -23, -103, -103, -103, -103, -103, -103, 63, -20, -52, -52, -52, -52, -52, -52, 63, -17, -1, -1, -1, -1, -1, -1, 0, 0, 0, 112, 47, 115, 112, 114, 101, 97, 100, 0, 44, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 0, 0, 0, 0, 63, -17, -1, -1, -1, -1, -1, -1, 63, -20, -52, -52, -52, -52, -52, -52, 63, -23, -103, -103, -103, -103, -103, -103, 63, -26, 102, 102, 102, 102, 102, 102, 63, -29, 51, 51, 51, 51, 51, 51, 63, -32, 0, 0, 0, 0, 0, 0, 63, -39, -103, -103, -103, -103, -103, -102, 63, -45, 51, 51, 51, 51, 51, 52, 63, -55, -103, -103, -103, -103, -103, -102, 63, -71, -103, -103, -103, -103, -103, -102, 0, 0, 0, 0, 0, 0, 0, 0 ],
					"saved_bundle_length" : 252,
					"text" : "/centroid : [0., 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],\n/spread : [1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0.]"
				}

			}
, 			{
				"box" : 				{
					"fontface" : 0,
					"fontsize" : 12.0,
					"id" : "obj-1",
					"linecount" : 2,
					"maxclass" : "o.expr.codebox",
					"numinlets" : 2,
					"numoutlets" : 3,
					"outlettype" : [ "FullPacket", "FullPacket", "FullPacket" ],
					"patching_rect" : [ 395.0, 149.0, 270.0, 46.0 ],
					"presentation_linecount" : 2,
					"text" : "/centroid = aseq(0, 1, 0.1),\n/spread = rev(aseq(0, 1, 0.1))"
				}

			}
 ],
		"lines" : [ 			{
				"patchline" : 				{
					"destination" : [ "obj-2", 1 ],
					"order" : 0,
					"source" : [ "obj-1", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-3", 0 ],
					"order" : 1,
					"source" : [ "obj-1", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-8", 0 ],
					"source" : [ "obj-12", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-6", 1 ],
					"order" : 0,
					"source" : [ "obj-3", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-9", 0 ],
					"order" : 1,
					"source" : [ "obj-3", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-14", 1 ],
					"order" : 0,
					"source" : [ "obj-8", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-76", 0 ],
					"order" : 1,
					"source" : [ "obj-8", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-12", 0 ],
					"source" : [ "obj-9", 0 ]
				}

			}
 ],
		"dependency_cache" : [ 			{
				"name" : "o.expr.codebox.mxo",
				"type" : "iLaX"
			}
, 			{
				"name" : "o.compose.mxo",
				"type" : "iLaX"
			}
, 			{
				"name" : "o.pack.mxo",
				"type" : "iLaX"
			}
, 			{
				"name" : "o.listenumerate.mxo",
				"type" : "iLaX"
			}
, 			{
				"name" : "o.route.mxo",
				"type" : "iLaX"
			}
 ],
		"autosave" : 0,
		"styles" : [ 			{
				"name" : "black on white",
				"number" : 				{
					"fontsize" : [ 12.0 ],
					"fontname" : [ "Arial" ],
					"textcolor_inverse" : [ 0.239216, 0.254902, 0.278431, 1.0 ]
				}
,
				"umenu" : 				{
					"bgfillcolor" : 					{
						"type" : "color",
						"color1" : [ 0.862745, 0.870588, 0.878431, 1.0 ],
						"color2" : [ 0.290196, 0.309804, 0.301961, 1.0 ],
						"color" : [ 1.0, 1.0, 1.0, 1.0 ],
						"angle" : 270.0,
						"proportion" : 0.39,
						"autogradient" : 0
					}
,
					"textcolor_inverse" : [ 0.239216, 0.254902, 0.278431, 1.0 ]
				}
,
				"parentstyle" : "",
				"multi" : 0
			}
, 			{
				"name" : "caption text",
				"default" : 				{
					"fontsize" : [ 11.0 ],
					"fontface" : [ 2 ]
				}
,
				"parentstyle" : "",
				"multi" : 0
			}
, 			{
				"name" : "section dividers",
				"default" : 				{
					"fontsize" : [ 15.0 ],
					"fontname" : [ "Arial" ],
					"fontface" : [ 3 ]
				}
,
				"parentstyle" : "",
				"multi" : 0
			}
, 			{
				"name" : "section info reg",
				"default" : 				{
					"fontsize" : [ 12.0 ],
					"fontname" : [ "Arial" ]
				}
,
				"parentstyle" : "",
				"multi" : 0
			}
, 			{
				"name" : "titles",
				"default" : 				{
					"fontsize" : [ 20.0 ],
					"fontname" : [ "Arial" ],
					"fontface" : [ 1 ]
				}
,
				"parentstyle" : "",
				"multi" : 0
			}
 ]
	}

}