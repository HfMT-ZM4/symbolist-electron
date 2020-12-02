{
	"patcher" : 	{
		"fileversion" : 1,
		"appversion" : 		{
			"major" : 8,
			"minor" : 1,
			"revision" : 8,
			"architecture" : "x64",
			"modernui" : 1
		}
,
		"classnamespace" : "box",
		"rect" : [ 182.0, 93.0, 1011.0, 703.0 ],
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
					"id" : "obj-66",
					"maxclass" : "message",
					"numinlets" : 2,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 193.0, 715.0, 177.0, 22.0 ]
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-61",
					"maxclass" : "number",
					"numinlets" : 1,
					"numoutlets" : 2,
					"outlettype" : [ "", "bang" ],
					"parameter_enable" : 0,
					"patching_rect" : [ 524.0, 215.0, 50.0, 22.0 ]
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-62",
					"maxclass" : "toggle",
					"numinlets" : 1,
					"numoutlets" : 1,
					"outlettype" : [ "int" ],
					"parameter_enable" : 0,
					"patching_rect" : [ 404.0, 193.0, 24.0, 24.0 ]
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-63",
					"maxclass" : "newobj",
					"numinlets" : 2,
					"numoutlets" : 1,
					"outlettype" : [ "bang" ],
					"patching_rect" : [ 403.0, 229.0, 100.0, 22.0 ],
					"text" : "metro 100"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-60",
					"maxclass" : "message",
					"numinlets" : 2,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 208.0, 313.0, 65.0, 22.0 ],
					"text" : "stop"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-59",
					"maxclass" : "message",
					"numinlets" : 2,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 309.0, 320.0, 65.0, 22.0 ],
					"text" : "0, 1 10000"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-57",
					"maxclass" : "newobj",
					"numinlets" : 3,
					"numoutlets" : 2,
					"outlettype" : [ "", "bang" ],
					"patching_rect" : [ 304.0, 356.0, 74.0, 22.0 ],
					"text" : "line 0. 0.001"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-56",
					"maxclass" : "multislider",
					"numinlets" : 1,
					"numoutlets" : 2,
					"outlettype" : [ "", "" ],
					"parameter_enable" : 0,
					"patching_rect" : [ 563.0, 744.5, 259.0, 80.0 ],
					"setminmax" : [ 0.0, 1.0 ],
					"setstyle" : 3
				}

			}
, 			{
				"box" : 				{
					"format" : 6,
					"id" : "obj-55",
					"maxclass" : "flonum",
					"numinlets" : 1,
					"numoutlets" : 2,
					"outlettype" : [ "", "bang" ],
					"parameter_enable" : 0,
					"patching_rect" : [ 427.5, 798.0, 50.0, 22.0 ]
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-53",
					"maxclass" : "button",
					"numinlets" : 1,
					"numoutlets" : 1,
					"outlettype" : [ "bang" ],
					"parameter_enable" : 0,
					"patching_rect" : [ 431.0, 736.0, 24.0, 24.0 ]
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-51",
					"maxclass" : "newobj",
					"numinlets" : 2,
					"numoutlets" : 1,
					"outlettype" : [ "float" ],
					"patching_rect" : [ 427.5, 762.0, 100.0, 22.0 ],
					"text" : "bench out"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-50",
					"maxclass" : "newobj",
					"numinlets" : 1,
					"numoutlets" : 2,
					"outlettype" : [ "", "list" ],
					"patching_rect" : [ 456.0, 602.0, 100.0, 22.0 ],
					"text" : "bench in"
				}

			}
, 			{
				"box" : 				{
					"fontface" : 0,
					"fontsize" : 12.0,
					"id" : "obj-49",
					"maxclass" : "o.compose",
					"numinlets" : 2,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 452.0, 69.0, 172.0, 24.0 ],
					"saved_bundle_data" : [ 35, 98, 117, 110, 100, 108, 101, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20, 47, 102, 111, 111, 0, 0, 0, 0, 44, 115, 115, 0, 97, 0, 0, 0, 98, 0, 0, 0 ],
					"saved_bundle_length" : 40,
					"text" : "/foo : [\"a\", \"b\"]"
				}

			}
, 			{
				"box" : 				{
					"fontface" : 0,
					"fontsize" : 12.0,
					"id" : "obj-48",
					"linecount" : 4,
					"maxclass" : "o.compose",
					"numinlets" : 2,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 352.0, 256.0, 172.0, 65.0 ],
					"presentation_linecount" : 4,
					"saved_bundle_data" : [ 35, 98, 117, 110, 100, 108, 101, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16, 47, 104, 111, 0, 44, 100, 0, 0, 63, -16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 56, 47, 115, 117, 98, 0, 0, 0, 0, 44, 46, 0, 0, 0, 0, 0, 40, 35, 98, 117, 110, 100, 108, 101, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20, 47, 98, 97, 114, 0, 0, 0, 0, 44, 100, 0, 0, 64, 0, 0, 0, 0, 0, 0, 0 ],
					"saved_bundle_length" : 96,
					"text" : "/ho : 1.,\n/sub : {\n\t/bar : 2.\n}"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-47",
					"maxclass" : "newobj",
					"numinlets" : 1,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 135.0, 812.0, 100.0, 22.0 ],
					"text" : "o.printbytes"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-45",
					"maxclass" : "newobj",
					"numinlets" : 1,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 411.0, 133.0, 100.0, 22.0 ],
					"text" : "o.printbytes"
				}

			}
, 			{
				"box" : 				{
					"fontface" : 0,
					"fontsize" : 12.0,
					"id" : "obj-44",
					"maxclass" : "o.compose",
					"numinlets" : 2,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 404.0, 29.0, 172.0, 24.0 ],
					"saved_bundle_data" : [ 35, 98, 117, 110, 100, 108, 101, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 32, 47, 102, 111, 111, 0, 0, 0, 0, 44, 115, 115, 100, 0, 0, 0, 0, 97, 0, 0, 0, 98, 0, 0, 0, 63, -16, 0, 0, 0, 0, 0, 0 ],
					"saved_bundle_length" : 52,
					"text" : "/foo : [\"a\", \"b\", 1.]"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-43",
					"maxclass" : "button",
					"numinlets" : 1,
					"numoutlets" : 1,
					"outlettype" : [ "bang" ],
					"parameter_enable" : 0,
					"patching_rect" : [ 459.0, 416.0, 24.0, 24.0 ]
				}

			}
, 			{
				"box" : 				{
					"format" : 6,
					"id" : "obj-41",
					"maxclass" : "flonum",
					"numinlets" : 1,
					"numoutlets" : 2,
					"outlettype" : [ "", "bang" ],
					"parameter_enable" : 0,
					"patching_rect" : [ 304.0, 400.0, 50.0, 22.0 ]
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-39",
					"maxclass" : "newobj",
					"numinlets" : 1,
					"numoutlets" : 1,
					"outlettype" : [ "FullPacket" ],
					"patching_rect" : [ 304.0, 434.0, 73.0, 22.0 ],
					"text" : "o.pack /time"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-38",
					"maxclass" : "newobj",
					"numinlets" : 2,
					"numoutlets" : 1,
					"outlettype" : [ "FullPacket" ],
					"patching_rect" : [ 304.0, 474.0, 130.0, 22.0 ],
					"text" : "o.pack /val /key lookup"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-35",
					"maxclass" : "newobj",
					"numinlets" : 2,
					"numoutlets" : 1,
					"outlettype" : [ "float" ],
					"patching_rect" : [ 604.0, 232.0, 53.0, 22.0 ],
					"text" : "* 3.1415"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-30",
					"maxclass" : "number",
					"numinlets" : 1,
					"numoutlets" : 2,
					"outlettype" : [ "", "bang" ],
					"parameter_enable" : 0,
					"patching_rect" : [ 871.0, 82.0, 50.0, 22.0 ]
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-26",
					"maxclass" : "number",
					"numinlets" : 1,
					"numoutlets" : 2,
					"outlettype" : [ "", "bang" ],
					"parameter_enable" : 0,
					"patching_rect" : [ 789.0, 237.0, 50.0, 22.0 ]
				}

			}
, 			{
				"box" : 				{
					"fontface" : 0,
					"fontsize" : 12.0,
					"id" : "obj-37",
					"linecount" : 2,
					"maxclass" : "o.compose",
					"numinlets" : 2,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 1013.0, 189.5, 309.0, 38.0 ],
					"saved_bundle_data" : [ 35, 98, 117, 110, 100, 108, 101, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16, 47, 120, 0, 0, 44, 100, 0, 0, -64, 36, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16, 47, 102, 0, 0, 44, 100, 0, 0, 63, -17, -82, 124, -3, 43, -100, -2 ],
					"saved_bundle_length" : 56,
					"text" : "/x : -10.,\n/f : 0.99005"
				}

			}
, 			{
				"box" : 				{
					"format" : 6,
					"id" : "obj-36",
					"maxclass" : "flonum",
					"numinlets" : 1,
					"numoutlets" : 2,
					"outlettype" : [ "", "bang" ],
					"parameter_enable" : 0,
					"patching_rect" : [ 1210.0, 60.0, 50.0, 22.0 ]
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-34",
					"maxclass" : "newobj",
					"numinlets" : 1,
					"numoutlets" : 1,
					"outlettype" : [ "FullPacket" ],
					"patching_rect" : [ 1210.0, 101.0, 100.0, 22.0 ],
					"text" : "o.pack /x"
				}

			}
, 			{
				"box" : 				{
					"fontface" : 0,
					"fontsize" : 12.0,
					"id" : "obj-33",
					"maxclass" : "o.expr.codebox",
					"numinlets" : 2,
					"numoutlets" : 3,
					"outlettype" : [ "FullPacket", "FullPacket", "FullPacket" ],
					"patching_rect" : [ 1210.0, 133.0, 198.0, 32.0 ],
					"text" : "/f = pow( e(), /x * 0.001)"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-32",
					"maxclass" : "newobj",
					"numinlets" : 2,
					"numoutlets" : 1,
					"outlettype" : [ "float" ],
					"patching_rect" : [ 679.0, 232.0, 100.0, 22.0 ],
					"text" : "* 2."
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-31",
					"maxclass" : "toggle",
					"numinlets" : 1,
					"numoutlets" : 1,
					"outlettype" : [ "int" ],
					"parameter_enable" : 0,
					"patching_rect" : [ 751.0, 60.0, 24.0, 24.0 ]
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-29",
					"maxclass" : "newobj",
					"numinlets" : 2,
					"numoutlets" : 1,
					"outlettype" : [ "bang" ],
					"patching_rect" : [ 750.0, 96.0, 100.0, 22.0 ],
					"text" : "metro 100"
				}

			}
, 			{
				"box" : 				{
					"fontface" : 0,
					"fontsize" : 12.0,
					"id" : "obj-28",
					"linecount" : 10,
					"maxclass" : "o.compose",
					"numinlets" : 2,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 797.0, 361.5, 309.0, 146.0 ],
					"saved_bundle_data" : [ 35, 98, 117, 110, 100, 108, 101, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -32, 47, 118, 97, 108, 0, 0, 0, 0, 44, 46, 0, 0, 0, 0, 0, -48, 35, 98, 117, 110, 100, 108, 101, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20, 47, 97, 122, 105, 109, 0, 0, 0, 44, 100, 0, 0, 63, -10, 41, -27, 64, 0, 0, 0, 0, 0, 0, 20, 47, 116, 105, 109, 101, 0, 0, 0, 44, 100, 0, 0, 63, -32, 96, -63, -128, 0, 0, 0, 0, 0, 0, 16, 47, 112, 105, 116, 99, 104, 0, 0, 44, 105, 0, 0, 0, 0, 0, 20, 0, 0, 0, 24, 47, 100, 117, 114, 97, 116, 105, 111, 110, 0, 0, 0, 44, 100, 0, 0, 63, -71, -103, -103, -103, -103, -103, -102, 0, 0, 0, 36, 47, 99, 108, 97, 115, 115, 0, 0, 44, 115, 0, 0, 114, 101, 99, 116, 97, 110, 103, 108, 101, 83, 116, 97, 118, 101, 65, 122, 105, 109, 117, 116, 104, 0, 0, 0, 0, 0, 0, 32, 47, 99, 111, 110, 116, 97, 105, 110, 101, 114, 0, 0, 44, 115, 0, 0, 114, 101, 99, 116, 97, 110, 103, 108, 101, 83, 116, 97, 118, 101, 0, 0, 0, 0, 0, 16, 47, 97, 109, 112, 0, 0, 0, 0, 44, 105, 0, 0, 0, 0, 0, 1, 0, 0, 0, 20, 47, 107, 101, 121, 0, 0, 0, 0, 44, 115, 0, 0, 100, 97, 116, 97, 0, 0, 0, 0 ],
					"saved_bundle_length" : 268,
					"text" : "/val : {\n\t/azim : 1.38523,\n\t/time : 0.511811,\n\t/pitch : 20,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1\n},\n/key : \"data\""
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-27",
					"maxclass" : "button",
					"numinlets" : 1,
					"numoutlets" : 1,
					"outlettype" : [ "bang" ],
					"parameter_enable" : 0,
					"patching_rect" : [ 679.0, 80.0, 24.0, 24.0 ]
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-24",
					"maxclass" : "newobj",
					"numinlets" : 2,
					"numoutlets" : 1,
					"outlettype" : [ "float" ],
					"patching_rect" : [ 597.0, 199.0, 39.0, 22.0 ],
					"text" : "/ 127."
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-25",
					"maxclass" : "newobj",
					"numinlets" : 2,
					"numoutlets" : 1,
					"outlettype" : [ "int" ],
					"patching_rect" : [ 597.0, 164.0, 73.0, 22.0 ],
					"text" : "random 128"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-23",
					"maxclass" : "newobj",
					"numinlets" : 2,
					"numoutlets" : 1,
					"outlettype" : [ "float" ],
					"patching_rect" : [ 679.0, 204.0, 39.0, 22.0 ],
					"text" : "/ 127."
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-22",
					"maxclass" : "newobj",
					"numinlets" : 2,
					"numoutlets" : 1,
					"outlettype" : [ "int" ],
					"patching_rect" : [ 679.0, 169.0, 73.0, 22.0 ],
					"text" : "random 128"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-21",
					"maxclass" : "newobj",
					"numinlets" : 2,
					"numoutlets" : 1,
					"outlettype" : [ "int" ],
					"patching_rect" : [ 748.0, 204.0, 73.0, 22.0 ],
					"text" : "random 128"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-20",
					"maxclass" : "newobj",
					"numinlets" : 2,
					"numoutlets" : 1,
					"outlettype" : [ "FullPacket" ],
					"patching_rect" : [ 630.0, 376.0, 48.0, 22.0 ],
					"text" : "o.union"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-19",
					"maxclass" : "newobj",
					"numinlets" : 4,
					"numoutlets" : 1,
					"outlettype" : [ "FullPacket" ],
					"patching_rect" : [ 630.0, 273.0, 207.0, 22.0 ],
					"text" : "o.pack /azim /time /pitch /duration 0.1"
				}

			}
, 			{
				"box" : 				{
					"fontface" : 0,
					"fontsize" : 12.0,
					"id" : "obj-18",
					"linecount" : 3,
					"maxclass" : "o.compose",
					"numinlets" : 2,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 833.0, 262.5, 309.0, 51.0 ],
					"saved_bundle_data" : [ 35, 98, 117, 110, 100, 108, 101, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 36, 47, 99, 108, 97, 115, 115, 0, 0, 44, 115, 0, 0, 114, 101, 99, 116, 97, 110, 103, 108, 101, 83, 116, 97, 118, 101, 65, 122, 105, 109, 117, 116, 104, 0, 0, 0, 0, 0, 0, 32, 47, 99, 111, 110, 116, 97, 105, 110, 101, 114, 0, 0, 44, 115, 0, 0, 114, 101, 99, 116, 97, 110, 103, 108, 101, 83, 116, 97, 118, 101, 0, 0, 0, 0, 0, 16, 47, 97, 109, 112, 0, 0, 0, 0, 44, 105, 0, 0, 0, 0, 0, 1 ],
					"saved_bundle_length" : 112,
					"text" : "/class : \"rectangleStaveAzimuth\",\n/container : \"rectangleStave\",\n/amp : 1"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-17",
					"maxclass" : "newobj",
					"numinlets" : 2,
					"numoutlets" : 1,
					"outlettype" : [ "FullPacket" ],
					"patching_rect" : [ 630.0, 425.0, 118.0, 22.0 ],
					"text" : "o.pack /val /key data"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-15",
					"maxclass" : "comment",
					"numinlets" : 1,
					"numoutlets" : 0,
					"patching_rect" : [ 824.0, 826.5, 255.0, 20.0 ],
					"text" : "no id here, so we won't be able to find it later..."
				}

			}
, 			{
				"box" : 				{
					"fontface" : 0,
					"fontsize" : 12.0,
					"id" : "obj-16",
					"linecount" : 9,
					"maxclass" : "o.compose",
					"numinlets" : 2,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 797.0, 856.0, 309.0, 133.0 ],
					"saved_bundle_data" : [ 35, 98, 117, 110, 100, 108, 101, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20, 47, 107, 101, 121, 0, 0, 0, 0, 44, 115, 0, 0, 99, 114, 101, 97, 116, 101, 0, 0, 0, 0, 0, -56, 47, 118, 97, 108, 0, 0, 0, 0, 44, 46, 0, 0, 0, 0, 0, -72, 35, 98, 117, 110, 100, 108, 101, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 36, 47, 110, 101, 119, 0, 0, 0, 0, 44, 115, 0, 0, 114, 101, 99, 116, 97, 110, 103, 108, 101, 83, 116, 97, 118, 101, 65, 122, 105, 109, 117, 116, 104, 0, 0, 0, 0, 0, 0, 32, 47, 99, 111, 110, 116, 97, 105, 110, 101, 114, 0, 0, 44, 115, 0, 0, 114, 101, 99, 116, 97, 110, 103, 108, 101, 83, 116, 97, 118, 101, 0, 0, 0, 0, 0, 20, 47, 116, 105, 109, 101, 0, 0, 0, 44, 100, 0, 0, 63, -32, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16, 47, 112, 105, 116, 99, 104, 0, 0, 44, 105, 0, 0, 0, 0, 0, 64, 0, 0, 0, 16, 47, 97, 109, 112, 0, 0, 0, 0, 44, 105, 0, 0, 0, 0, 0, 1, 0, 0, 0, 24, 47, 97, 122, 105, 109, 117, 116, 104, 0, 0, 0, 0, 44, 100, 0, 0, 63, -61, 51, 51, 51, 51, 51, 51 ],
					"saved_bundle_length" : 244,
					"text" : "/key : \"create\",\n/val : {\n\t/new : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/time : 0.5,\n\t/pitch : 64,\n\t/amp : 1,\n\t/azimuth : 0.15\n}"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-14",
					"maxclass" : "comment",
					"numinlets" : 1,
					"numoutlets" : 0,
					"patching_rect" : [ 812.0, 487.5, 255.0, 20.0 ],
					"text" : "no id here, so we won't be able to find it later..."
				}

			}
, 			{
				"box" : 				{
					"fontface" : 0,
					"fontsize" : 12.0,
					"id" : "obj-12",
					"linecount" : 9,
					"maxclass" : "o.compose",
					"numinlets" : 2,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 789.0, 515.0, 309.0, 133.0 ],
					"saved_bundle_data" : [ 35, 98, 117, 110, 100, 108, 101, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20, 47, 107, 101, 121, 0, 0, 0, 0, 44, 115, 0, 0, 100, 97, 116, 97, 0, 0, 0, 0, 0, 0, 0, -60, 47, 118, 97, 108, 0, 0, 0, 0, 44, 46, 0, 0, 0, 0, 0, -76, 35, 98, 117, 110, 100, 108, 101, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 36, 47, 99, 108, 97, 115, 115, 0, 0, 44, 115, 0, 0, 114, 101, 99, 116, 97, 110, 103, 108, 101, 83, 116, 97, 118, 101, 65, 122, 105, 109, 117, 116, 104, 0, 0, 0, 0, 0, 0, 32, 47, 99, 111, 110, 116, 97, 105, 110, 101, 114, 0, 0, 44, 115, 0, 0, 114, 101, 99, 116, 97, 110, 103, 108, 101, 83, 116, 97, 118, 101, 0, 0, 0, 0, 0, 20, 47, 116, 105, 109, 101, 0, 0, 0, 44, 100, 0, 0, 63, -32, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16, 47, 112, 105, 116, 99, 104, 0, 0, 44, 105, 0, 0, 0, 0, 0, 64, 0, 0, 0, 16, 47, 97, 109, 112, 0, 0, 0, 0, 44, 105, 0, 0, 0, 0, 0, 1, 0, 0, 0, 20, 47, 97, 122, 105, 109, 0, 0, 0, 44, 100, 0, 0, 63, -61, 51, 51, 51, 51, 51, 51 ],
					"saved_bundle_length" : 240,
					"text" : "/key : \"data\",\n/val : {\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/time : 0.5,\n\t/pitch : 64,\n\t/amp : 1,\n\t/azim : 0.15\n}"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-9",
					"maxclass" : "newobj",
					"numinlets" : 1,
					"numoutlets" : 1,
					"outlettype" : [ "FullPacket" ],
					"patching_rect" : [ 1127.0, 661.0, 100.0, 22.0 ],
					"text" : "o.flatten"
				}

			}
, 			{
				"box" : 				{
					"fontface" : 0,
					"fontsize" : 12.0,
					"id" : "obj-2",
					"linecount" : 2011,
					"maxclass" : "o.display",
					"numinlets" : 1,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ -145.0, 792.0, 551.0, 27358.0 ],
					"text" : "/lookup : [{\n\t/azim : 3.11676,\n\t/time : 0.80315,\n\t/pitch : 116.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_a343542f-1f82-4ac1-b3db-e0eaeec839aa\",\n\t/phase : 0.928504\n}, {\n\t/azim : 0.371043,\n\t/time : 0.80315,\n\t/pitch : 0.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_44ea8235-103b-4728-bbc5-18f2cb975a3e\",\n\t/phase : 0.928504\n}, {\n\t/azim : 1.08839,\n\t/time : 0.80315,\n\t/pitch : 69.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_9ca47d64-1f5c-425b-b7f8-0ec902b21ad3\",\n\t/phase : 0.928504\n}, {\n\t/azim : 2.77046,\n\t/time : 0.80315,\n\t/pitch : 118.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_e40fc668-609a-404c-8c99-4e689cb715dc\",\n\t/phase : 0.928504\n}, {\n\t/azim : 2.84467,\n\t/time : 0.80315,\n\t/pitch : 65.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_9b975d66-534e-4dff-8526-12a4418cf8b5\",\n\t/phase : 0.928504\n}, {\n\t/azim : 0.667878,\n\t/time : 0.80315,\n\t/pitch : 104.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_550d8ea5-4d53-4046-8745-2d3e0bc800bb\",\n\t/phase : 0.928504\n}, {\n\t/azim : 1.63259,\n\t/time : 0.80315,\n\t/pitch : 94.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_229871fb-9f53-4ea6-ae0f-700e77559c51\",\n\t/phase : 0.928504\n}, {\n\t/azim : 2.64678,\n\t/time : 0.80315,\n\t/pitch : 20.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_c69c4b9e-408d-4fb3-8b3c-9aa687403ef2\",\n\t/phase : 0.928504\n}, {\n\t/azim : 1.13787,\n\t/time : 0.80315,\n\t/pitch : 76.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_a4251b94-f8c5-471b-840d-a58cf2bb58a1\",\n\t/phase : 0.928504\n}, {\n\t/azim : 1.28628,\n\t/time : 0.80315,\n\t/pitch : 17.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_4b24fb29-e6b0-44bc-8804-3996b18d9f0c\",\n\t/phase : 0.928504\n}, {\n\t/azim : 0.568933,\n\t/time : 0.80315,\n\t/pitch : 42.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_da93251a-1aac-4bad-86cd-5870bdd335d1\",\n\t/phase : 0.928504\n}, {\n\t/azim : 0.544197,\n\t/time : 0.80315,\n\t/pitch : 115.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_db7c5eca-9c48-430e-8dc3-37ca4c508d79\",\n\t/phase : 0.928504\n}, {\n\t/azim : 0.964713,\n\t/time : 0.80315,\n\t/pitch : 32.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_4036bf48-c427-49fa-85c3-a8c9ca23cf60\",\n\t/phase : 0.928504\n}, {\n\t/azim : 1.21207,\n\t/time : 0.80315,\n\t/pitch : 12.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_d8cb3f2b-7a41-4e44-8ed2-972e5a69ca97\",\n\t/phase : 0.928504\n}, {\n\t/azim : 2.22626,\n\t/time : 0.80315,\n\t/pitch : 93.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_aecbfaea-34ad-40f4-9a75-23e0e1b55195\",\n\t/phase : 0.928504\n}, {\n\t/azim : 0.148417,\n\t/time : 0.80315,\n\t/pitch : 14.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_80a88074-5fc7-4f52-a285-c6ae6bafa70e\",\n\t/phase : 0.928504\n}, {\n\t/azim : 1.58312,\n\t/time : 0.80315,\n\t/pitch : 98.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_95c7c4e0-ee9f-4c5f-85ab-cb0f75a06f07\",\n\t/phase : 0.928504\n}, {\n\t/azim : 2.67151,\n\t/time : 0.80315,\n\t/pitch : 60.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_e1d4e8af-4b42-48d2-aa77-3742d1f955cc\",\n\t/phase : 0.928504\n}, {\n\t/azim : 0.841031,\n\t/time : 0.80315,\n\t/pitch : 94.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_55450c72-1e3e-4b40-984c-306319b278eb\",\n\t/phase : 0.928504\n}, {\n\t/azim : 1.60785,\n\t/time : 0.80315,\n\t/pitch : 117.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_fa000b66-d45b-45be-8ccf-bd08433635a3\",\n\t/phase : 0.928504\n}, {\n\t/azim : 2.47362,\n\t/time : 0.80315,\n\t/pitch : 41.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_2285a431-26fa-4ad1-90ff-0d2e3e046ec1\",\n\t/phase : 0.928504\n}, {\n\t/azim : 0.123681,\n\t/time : 0.80315,\n\t/pitch : 43.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_2125fce6-0a18-492a-8812-c37ff8ba4e7a\",\n\t/phase : 0.928504\n}, {\n\t/azim : 0.692614,\n\t/time : 0.80315,\n\t/pitch : 56.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_f4a9a884-45fb-4071-b022-8e7aa2594219\",\n\t/phase : 0.928504\n}, {\n\t/azim : 1.4347,\n\t/time : 0.80315,\n\t/pitch : 88.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_a93e3fa3-979b-4791-8b32-6da6cf45b11e\",\n\t/phase : 0.928504\n}, {\n\t/azim : 2.10258,\n\t/time : 0.80315,\n\t/pitch : 35.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_a9de51d8-2e74-499c-a1e3-3cdbf6fb26ea\",\n\t/phase : 0.928504\n}, {\n\t/azim : 1.53365,\n\t/time : 0.811024,\n\t/pitch : 34.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_7e844822-b595-4de1-9ba0-0fa7cee8249b\",\n\t/phase : 0.849764\n}, {\n\t/azim : 2.30047,\n\t/time : 0.811024,\n\t/pitch : 102.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_8b240bf5-0e14-4d9f-aa74-55e8a5bd4e90\",\n\t/phase : 0.849764\n}, {\n\t/azim : 0.469988,\n\t/time : 0.811024,\n\t/pitch : 89.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_b1ea0920-743c-4d58-8a1e-85ad8885569c\",\n\t/phase : 0.849764\n}, {\n\t/azim : 0.692614,\n\t/time : 0.811024,\n\t/pitch : 21.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_a5376a59-ea21-44e3-97a6-731a4750a92b\",\n\t/phase : 0.849764\n}, {\n\t/azim : 2.10258,\n\t/time : 0.811024,\n\t/pitch : 98.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_5a5e7f2f-914d-4f1b-b6af-30dfc4a214f4\",\n\t/phase : 0.849764\n}, {\n\t/azim : 0.890504,\n\t/time : 0.811024,\n\t/pitch : 78.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_6d7387c0-168b-4b79-a6a8-fce98c2a903e\",\n\t/phase : 0.849764\n}, {\n\t/azim : 2.96835,\n\t/time : 0.811024,\n\t/pitch : 118.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_8b255c2c-8256-46a6-a511-496cf38bd512\",\n\t/phase : 0.849764\n}, {\n\t/azim : 2.91887,\n\t/time : 0.811024,\n\t/pitch : 118.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_66bfb595-0b84-4738-83e9-038087cbba84\",\n\t/phase : 0.849764\n}, {\n\t/azim : 2.3252,\n\t/time : 0.811024,\n\t/pitch : 95.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_564e8deb-44a6-4ee4-821e-00e064ab1624\",\n\t/phase : 0.849764\n}, {\n\t/azim : 1.90469,\n\t/time : 0.811024,\n\t/pitch : 71.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_11bf5fea-0c75-4e6f-9a32-47655f355c28\",\n\t/phase : 0.849764\n}, {\n\t/azim : 2.3252,\n\t/time : 0.811024,\n\t/pitch : 52.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_f6aebe2a-a910-4e25-b41d-1d5544e6266c\",\n\t/phase : 0.849764\n}, {\n\t/azim : 0.39578,\n\t/time : 0.811024,\n\t/pitch : 28.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_a246982b-c469-44a9-80af-91e3d2567fb3\",\n\t/phase : 0.849764\n}, {\n\t/azim : 1.23681,\n\t/time : 0.811024,\n\t/pitch : 37.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_3343e911-0d22-435e-8f93-b4de955dd9fc\",\n\t/phase : 0.849764\n}, {\n\t/azim : 2.15205,\n\t/time : 0.811024,\n\t/pitch : 96.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_0d94f4aa-06d0-4a79-98d7-bea5c303ebab\",\n\t/phase : 0.849764\n}, {\n\t/azim : 1.87995,\n\t/time : 0.811024,\n\t/pitch : 118.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_99f3c494-b08a-43a0-9669-b181d6ba73b2\",\n\t/phase : 0.849764\n}, {\n\t/azim : 0.964713,\n\t/time : 0.811024,\n\t/pitch : 86.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_6a57272c-a27c-490a-bf65-6f5768b99ad4\",\n\t/phase : 0.849764\n}, {\n\t/azim : 0.469988,\n\t/time : 0.811024,\n\t/pitch : 57.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_b1256b70-2fd7-4c86-837b-101e488f2329\",\n\t/phase : 0.849764\n}, {\n\t/azim : 1.48417,\n\t/time : 0.811024,\n\t/pitch : 106.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_3e6727d4-a2e3-4c54-b2a0-1f59536ef483\",\n\t/phase : 0.849764\n}, {\n\t/azim : 1.55838,\n\t/time : 0.811024,\n\t/pitch : 99.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_27c9dd0c-7068-4b05-9041-d5ebed26abe1\",\n\t/phase : 0.849764\n}, {\n\t/azim : 0.321571,\n\t/time : 0.811024,\n\t/pitch : 109.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_7e64b8a9-1ed5-445a-9812-4540d681ef53\",\n\t/phase : 0.849764\n}, {\n\t/azim : 3.11676,\n\t/time : 0.811024,\n\t/pitch : 80.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_b5f03c36-516d-475d-a6b2-1544937c4250\",\n\t/phase : 0.849764\n}, {\n\t/azim : 2.22626,\n\t/time : 0.818898,\n\t/pitch : 111.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_21baccad-ead4-43c1-a8d0-830fdff6377c\",\n\t/phase : 0.771024\n}, {\n\t/azim : 0.0494724,\n\t/time : 0.818898,\n\t/pitch : 85.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_5be9ff1d-dd4c-4713-a669-78e272b63902\",\n\t/phase : 0.771024\n}, {\n\t/azim : 0.0247362,\n\t/time : 0.818898,\n\t/pitch : 72.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_f8f768f9-6bad-46b7-ba94-dbe9d0993b36\",\n\t/phase : 0.771024\n}, {\n\t/azim : 2.77046,\n\t/time : 0.818898,\n\t/pitch : 57.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_234a4c71-8964-459a-96db-9ab0c1371a60\",\n\t/phase : 0.771024\n}, {\n\t/azim : 2.37468,\n\t/time : 0.818898,\n\t/pitch : 23.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_4623f8f6-92a0-4979-977d-6d52817a8902\",\n\t/phase : 0.771024\n}, {\n\t/azim : 0.989449,\n\t/time : 0.818898,\n\t/pitch : 47.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_e466eff7-2947-46f1-ba3d-0eb8cc36d9ce\",\n\t/phase : 0.771024\n}, {\n\t/azim : 0.841031,\n\t/time : 0.818898,\n\t/pitch : 22.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_91d7f79f-df4c-4792-a81a-0e2c4456cb7c\",\n\t/phase : 0.771024\n}, {\n\t/azim : 0.71735,\n\t/time : 0.818898,\n\t/pitch : 49.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_621a9877-3b08-4dac-aef7-8319dabed4e5\",\n\t/phase : 0.771024\n}, {\n\t/azim : 2.99308,\n\t/time : 0.818898,\n\t/pitch : 59.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_0f429559-ba65-4645-a047-ef7c0f1a6dcf\",\n\t/phase : 0.771024\n}, {\n\t/azim : 2.99308,\n\t/time : 0.818898,\n\t/pitch : 79.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_624bc4c9-73cf-4d80-9f08-2ec161d9e837\",\n\t/phase : 0.771024\n}, {\n\t/azim : 0.667878,\n\t/time : 0.818898,\n\t/pitch : 43.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_cc0a1fd4-7676-4ef8-9740-6f37c8c01d3d\",\n\t/phase : 0.771024\n}, {\n\t/azim : 0.0742087,\n\t/time : 0.818898,\n\t/pitch : 86.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_556897d7-4afc-474b-bd06-9d2ec0648afd\",\n\t/phase : 0.771024\n}, {\n\t/azim : 0.148417,\n\t/time : 0.826772,\n\t/pitch : 40.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_2c7355b1-9897-40e9-bcc8-777f885be7f1\",\n\t/phase : 0.692284\n}, {\n\t/azim : 2.3252,\n\t/time : 0.826772,\n\t/pitch : 88.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_8eb72dbb-7cb5-4899-8789-c409da021480\",\n\t/phase : 0.692284\n}, {\n\t/azim : 1.06366,\n\t/time : 0.826772,\n\t/pitch : 89.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_a77a7ea6-6672-487e-b63a-ff9c91f1909a\",\n\t/phase : 0.692284\n}, {\n\t/azim : 0.519461,\n\t/time : 0.826772,\n\t/pitch : 79.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_eb15dcfe-6436-4ad9-803b-312524731d56\",\n\t/phase : 0.692284\n}, {\n\t/azim : 1.38523,\n\t/time : 0.826772,\n\t/pitch : 35.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_fea9b6f4-d940-461a-a982-46b41e9e2b77\",\n\t/phase : 0.692284\n}, {\n\t/azim : 2.34994,\n\t/time : 0.826772,\n\t/pitch : 32.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_ebcdfe46-2058-405f-b38c-c9cabcf28ef3\",\n\t/phase : 0.692284\n}, {\n\t/azim : 2.22626,\n\t/time : 0.826772,\n\t/pitch : 38.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_3ff9a949-a739-4413-9c85-2d6d1897e4b5\",\n\t/phase : 0.692284\n}, {\n\t/azim : 2.94361,\n\t/time : 0.826772,\n\t/pitch : 51.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_4cc16ec1-96f6-46f2-8f51-46d9b0a25d0c\",\n\t/phase : 0.692284\n}, {\n\t/azim : 0.91524,\n\t/time : 0.826772,\n\t/pitch : 86.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_1fd9fb44-d6ee-4475-92db-7412445a77c4\",\n\t/phase : 0.692284\n}, {\n\t/azim : 2.00363,\n\t/time : 0.826772,\n\t/pitch : 36.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_87bde7de-94b1-464c-89e0-bf2131a91f56\",\n\t/phase : 0.692284\n}, {\n\t/azim : 1.92943,\n\t/time : 0.826772,\n\t/pitch : 109.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_ff5bb7fd-d0b5-42f9-b70e-cf423d88d35a\",\n\t/phase : 0.692284\n}, {\n\t/azim : 0.841031,\n\t/time : 0.826772,\n\t/pitch : 107.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_62474e27-e31c-48b3-9215-2ca795726931\",\n\t/phase : 0.692284\n}, {\n\t/azim : 2.251,\n\t/time : 0.826772,\n\t/pitch : 103.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_525e04f6-6e5b-4bf8-acc2-d93735543480\",\n\t/phase : 0.692284\n}, {\n\t/azim : 2.20152,\n\t/time : 0.826772,\n\t/pitch : 81.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_7d14e36c-35e9-41b7-8b31-f6917f47608f\",\n\t/phase : 0.692284\n}, {\n\t/azim : 2.77046,\n\t/time : 0.826772,\n\t/pitch : 117.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_ab13b236-0eea-4518-87c2-b9e35a2cfbd6\",\n\t/phase : 0.692284\n}, {\n\t/azim : 0.766823,\n\t/time : 0.826772,\n\t/pitch : 8.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_d9542c35-197f-4087-b85d-ec6f21659406\",\n\t/phase : 0.692284\n}, {\n\t/azim : 2.17679,\n\t/time : 0.834646,\n\t/pitch : 60.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_3636cbd6-7eec-4836-b34a-24edb7cdaf63\",\n\t/phase : 0.613543\n}, {\n\t/azim : 2.10258,\n\t/time : 0.834646,\n\t/pitch : 8.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_405c5883-e8be-4ae8-a7be-6fab9f2bdcd2\",\n\t/phase : 0.613543\n}, {\n\t/azim : 1.40996,\n\t/time : 0.834646,\n\t/pitch : 11.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_5c673b25-788d-4234-9aa6-e6c18eb337ff\",\n\t/phase : 0.613543\n}, {\n\t/azim : 3.01782,\n\t/time : 0.834646,\n\t/pitch : 51.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_1a13d314-fcc9-4d83-9cc7-88e92cdfdeec\",\n\t/phase : 0.613543\n}, {\n\t/azim : 2.84467,\n\t/time : 0.834646,\n\t/pitch : 75.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_63115fa9-6959-4305-82e9-2b04651a6f53\",\n\t/phase : 0.613543\n}, {\n\t/azim : 1.55838,\n\t/time : 0.834646,\n\t/pitch : 91.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_51b52305-cdbc-4d24-8a3f-81c6a1a1876d\",\n\t/phase : 0.613543\n}, {\n\t/azim : 2.64678,\n\t/time : 0.834646,\n\t/pitch : 118.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_40f7d934-6775-4c20-b322-4da0baf126ed\",\n\t/phase : 0.613543\n}, {\n\t/azim : 1.08839,\n\t/time : 0.834646,\n\t/pitch : 72.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_29b52a09-c670-44cd-a954-cde11d60df9c\",\n\t/phase : 0.613543\n}, {\n\t/azim : 1.68206,\n\t/time : 0.834646,\n\t/pitch : 24.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_d9ea5992-f8b5-4ba8-8927-ce999722fa6f\",\n\t/phase : 0.613543\n}, {\n\t/azim : 0.519461,\n\t/time : 0.834646,\n\t/pitch : 37.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_93fae447-89f8-486e-aba2-9a5b29a0b199\",\n\t/phase : 0.613543\n}, {\n\t/azim : 1.85522,\n\t/time : 0.834646,\n\t/pitch : 42.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_bdaa644e-62af-482f-a81c-9c40449e3b96\",\n\t/phase : 0.613543\n}, {\n\t/azim : 1.58312,\n\t/time : 0.834646,\n\t/pitch : 71.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_3964b07c-76ef-412a-9c9b-aaef25319928\",\n\t/phase : 0.613543\n}, {\n\t/azim : 2.44889,\n\t/time : 0.834646,\n\t/pitch : 110.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_3ebf060c-a903-4e7b-8372-30c3fe40b6b5\",\n\t/phase : 0.613543\n}, {\n\t/azim : 0.0494724,\n\t/time : 0.834646,\n\t/pitch : 123.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_6555dcbc-9ecf-4160-97da-1c4e601ac9fc\",\n\t/phase : 0.613543\n}, {\n\t/azim : 0.247362,\n\t/time : 0.834646,\n\t/pitch : 76.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_13181d6e-87d5-4844-81b5-8d4acdc2c949\",\n\t/phase : 0.613543\n}, {\n\t/azim : 3.11676,\n\t/time : 0.834646,\n\t/pitch : 102.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_86fe96c5-bd3b-4c8f-ab87-68dc27bd072b\",\n\t/phase : 0.613543\n}, {\n\t/azim : 1.36049,\n\t/time : 0.834646,\n\t/pitch : 15.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_88aaa5c2-ac90-4211-b864-8a3c2a5f8af7\",\n\t/phase : 0.613543\n}, {\n\t/azim : 0.816295,\n\t/time : 0.834646,\n\t/pitch : 115.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_52a5890c-110c-4b7a-b34f-7c42be329ad2\",\n\t/phase : 0.613543\n}, {\n\t/azim : 0.272098,\n\t/time : 0.834646,\n\t/pitch : 127.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_40088c68-6f20-4938-b2be-1e324c6ba28c\",\n\t/phase : 0.613543\n}, {\n\t/azim : 1.03892,\n\t/time : 0.84252,\n\t/pitch : 22.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_9883aecd-3fa7-4167-8983-05baf617b0d8\",\n\t/phase : 0.534803\n}, {\n\t/azim : 1.1626,\n\t/time : 0.84252,\n\t/pitch : 68.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_ac6cf472-27bc-4b78-8221-9b36b2b7227d\",\n\t/phase : 0.534803\n}, {\n\t/azim : 1.7068,\n\t/time : 0.84252,\n\t/pitch : 66.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_063e2e3e-2bd2-48b8-b1a7-89a380c91a37\",\n\t/phase : 0.534803\n}, {\n\t/azim : 0.148417,\n\t/time : 0.84252,\n\t/pitch : 29.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_925c3411-8da2-4f0b-a842-32e8964806bc\",\n\t/phase : 0.534803\n}, {\n\t/azim : 0.346307,\n\t/time : 0.84252,\n\t/pitch : 101.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_86cd2dd8-9077-469b-8197-839d284c807e\",\n\t/phase : 0.534803\n}, {\n\t/azim : 0.643142,\n\t/time : 0.84252,\n\t/pitch : 28.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_c9458499-c599-4891-8dfa-aac1d9fdf3f5\",\n\t/phase : 0.534803\n}, {\n\t/azim : 0.890504,\n\t/time : 0.84252,\n\t/pitch : 72.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_596f9c0a-2091-4b46-95ff-355fb03e0839\",\n\t/phase : 0.534803\n}, {\n\t/azim : 1.18734,\n\t/time : 0.84252,\n\t/pitch : 83.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_715c62dd-18b9-438a-b7ab-695ac098d8cf\",\n\t/phase : 0.534803\n}, {\n\t/azim : 2.3252,\n\t/time : 0.84252,\n\t/pitch : 14.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_73a1ff23-a772-49c2-a657-fda3d08b1c19\",\n\t/phase : 0.534803\n}, {\n\t/azim : 2.72098,\n\t/time : 0.84252,\n\t/pitch : 102.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_a27132a9-643c-4ae9-94bd-ab497f2f4981\",\n\t/phase : 0.534803\n}, {\n\t/azim : 2.20152,\n\t/time : 0.84252,\n\t/pitch : 114.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_177ec70b-75ba-4a25-9f53-38260ecd99b4\",\n\t/phase : 0.534803\n}, {\n\t/azim : 0.568933,\n\t/time : 0.84252,\n\t/pitch : 8.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_0e8f1a59-3ad9-4aab-812d-eb1ae6fedbd1\",\n\t/phase : 0.534803\n}, {\n\t/azim : 1.01419,\n\t/time : 0.84252,\n\t/pitch : 107.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_907f8ad6-dcad-430e-8780-b1d45eb22106\",\n\t/phase : 0.534803\n}, {\n\t/azim : 0.296835,\n\t/time : 0.84252,\n\t/pitch : 81.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_e42b4fba-1ccd-40f3-8303-42645ef3d42b\",\n\t/phase : 0.534803\n}, {\n\t/azim : 1.87995,\n\t/time : 0.850394,\n\t/pitch : 94.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_f2261c6f-fb93-45f3-9e8e-f61d5786598b\",\n\t/phase : 0.456063\n}, {\n\t/azim : 1.58312,\n\t/time : 0.850394,\n\t/pitch : 113.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_6a8d3312-dd69-4aa7-999e-8eee483e4c39\",\n\t/phase : 0.456063\n}, {\n\t/azim : 2.81993,\n\t/time : 0.850394,\n\t/pitch : 100.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_d1f549fa-9038-4a08-ac52-2b0e7dafe986\",\n\t/phase : 0.456063\n}, {\n\t/azim : 2.12732,\n\t/time : 0.850394,\n\t/pitch : 31.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_70a19c0d-84d1-4197-84c2-4179da38a57c\",\n\t/phase : 0.456063\n}, {\n\t/azim : 1.9789,\n\t/time : 0.850394,\n\t/pitch : 18.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_854f04f0-73c0-4dbc-974d-8e1fa2336651\",\n\t/phase : 0.456063\n}, {\n\t/azim : 0.148417,\n\t/time : 0.850394,\n\t/pitch : 54.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_14a99aa3-53a5-4227-954c-7cfa6694706e\",\n\t/phase : 0.456063\n}, {\n\t/azim : 0.222626,\n\t/time : 0.850394,\n\t/pitch : 90.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_3cd19448-aa7f-49ab-b4cf-eade52c476a8\",\n\t/phase : 0.456063\n}, {\n\t/azim : 1.38523,\n\t/time : 0.850394,\n\t/pitch : 10.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_ed43a892-a309-4065-860f-53ccc1582732\",\n\t/phase : 0.456063\n}, {\n\t/azim : 0.865768,\n\t/time : 0.850394,\n\t/pitch : 38.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_f4aaf7c6-d3b9-41e8-951c-8d05c782e23d\",\n\t/phase : 0.456063\n}, {\n\t/azim : 2.251,\n\t/time : 0.850394,\n\t/pitch : 100.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_87a34bec-fb40-4510-bc3c-d6f9e156a2d6\",\n\t/phase : 0.456063\n}, {\n\t/azim : 1.53365,\n\t/time : 0.850394,\n\t/pitch : 93.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_a648176a-1486-434c-bc3e-07d3d29f88e9\",\n\t/phase : 0.456063\n}, {\n\t/azim : 2.52309,\n\t/time : 0.858268,\n\t/pitch : 56.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_ac8d5bc8-77bc-4e51-a82d-8937360ab9fc\",\n\t/phase : 0.377323\n}, {\n\t/azim : 0.593669,\n\t/time : 0.858268,\n\t/pitch : 86.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_976e4692-d844-4ddb-9de3-e91b7ce621d9\",\n\t/phase : 0.377323\n}, {\n\t/azim : 2.07784,\n\t/time : 0.858268,\n\t/pitch : 118.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_a16a1bae-5a12-468b-a7cd-20f3d22c93f9\",\n\t/phase : 0.377323\n}, {\n\t/azim : 1.80574,\n\t/time : 0.858268,\n\t/pitch : 75.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_5998d824-84df-4f9d-88e6-d3f5a8a7626e\",\n\t/phase : 0.377323\n}, {\n\t/azim : 3.04256,\n\t/time : 0.858268,\n\t/pitch : 18.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_fa04b954-b55f-4e9c-b35a-fdaa7908eaf4\",\n\t/phase : 0.377323\n}, {\n\t/azim : 0.544197,\n\t/time : 0.858268,\n\t/pitch : 19.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_80ec7165-98a4-4972-833e-87c79198f2ad\",\n\t/phase : 0.377323\n}, {\n\t/azim : 1.31102,\n\t/time : 0.858268,\n\t/pitch : 125.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_151e7f4c-2f1d-4e1c-8e6a-b952461eb59d\",\n\t/phase : 0.377323\n}, {\n\t/azim : 2.39941,\n\t/time : 0.858268,\n\t/pitch : 2.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_7a18ba41-bded-4813-aad0-8f5527b65fa4\",\n\t/phase : 0.377323\n}, {\n\t/azim : 0.841031,\n\t/time : 0.858268,\n\t/pitch : 55.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_a72a31dc-0732-4c13-9fdf-c1c9778f191b\",\n\t/phase : 0.377323\n}, {\n\t/azim : 1.92943,\n\t/time : 0.858268,\n\t/pitch : 45.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_b03d92b1-2421-4ef6-8a12-123e7c8f330d\",\n\t/phase : 0.377323\n}, {\n\t/azim : 1.38523,\n\t/time : 0.858268,\n\t/pitch : 42.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_866bfb80-9b44-4835-8adc-e4ba28978dcc\",\n\t/phase : 0.377323\n}, {\n\t/azim : 1.73154,\n\t/time : 0.858268,\n\t/pitch : 95.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_ba7ca4b9-136e-4be9-a24d-852dd5494976\",\n\t/phase : 0.377323\n}, {\n\t/azim : 0.296835,\n\t/time : 0.858268,\n\t/pitch : 39.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_01e86fc0-899f-4d31-ba02-ef8be974f8cf\",\n\t/phase : 0.377323\n}, {\n\t/azim : 1.21207,\n\t/time : 0.858268,\n\t/pitch : 6.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_04697baa-4da6-4ec2-a158-acbd94a43199\",\n\t/phase : 0.377323\n}, {\n\t/azim : 1.55838,\n\t/time : 0.858268,\n\t/pitch : 125.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_c5828d3e-84d7-41e3-bd07-ef31f8ff7f2c\",\n\t/phase : 0.377323\n}, {\n\t/azim : 1.06366,\n\t/time : 0.858268,\n\t/pitch : 70.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_76c80b55-ab72-4b35-a38b-3fc17a7a7a37\",\n\t/phase : 0.377323\n}, {\n\t/azim : 0.989449,\n\t/time : 0.858268,\n\t/pitch : 8.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_ddc89df2-64fc-44c8-8a74-ba385f9e17bd\",\n\t/phase : 0.377323\n}, {\n\t/azim : 2.99308,\n\t/time : 0.858268,\n\t/pitch : 31.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_e51f1f0a-5d7b-49f0-ad2d-11bab60e546d\",\n\t/phase : 0.377323\n}, {\n\t/azim : 2.62204,\n\t/time : 0.858268,\n\t/pitch : 115.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_7e0bbf67-b197-46a2-9f28-79c526e19873\",\n\t/phase : 0.377323\n}, {\n\t/azim : 0.71735,\n\t/time : 0.866142,\n\t/pitch : 51.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_ad0c4bea-727d-4c27-9629-ce67eef50c1a\",\n\t/phase : 0.298583\n}, {\n\t/azim : 1.48417,\n\t/time : 0.866142,\n\t/pitch : 81.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_a7abde97-c4fc-4876-8ae6-60e11ae983c2\",\n\t/phase : 0.298583\n}, {\n\t/azim : 1.73154,\n\t/time : 0.866142,\n\t/pitch : 95.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_069e3964-0662-4438-a424-dad19044a9af\",\n\t/phase : 0.298583\n}, {\n\t/azim : 2.94361,\n\t/time : 0.866142,\n\t/pitch : 52.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_897fc898-b700-4537-9e15-137b269a9b6a\",\n\t/phase : 0.298583\n}, {\n\t/azim : 1.36049,\n\t/time : 0.866142,\n\t/pitch : 82.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_13f3dd87-10cf-44eb-9714-c303b8272962\",\n\t/phase : 0.298583\n}, {\n\t/azim : 0.0247362,\n\t/time : 0.866142,\n\t/pitch : 68.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_3d6e6183-6ce8-4680-a138-27ec917e010f\",\n\t/phase : 0.298583\n}, {\n\t/azim : 1.73154,\n\t/time : 0.866142,\n\t/pitch : 119.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_eb0e54e8-a9ec-4b2e-941f-d9f77bf7df1a\",\n\t/phase : 0.298583\n}, {\n\t/azim : 3.11676,\n\t/time : 0.866142,\n\t/pitch : 110.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_4e4a66d7-8d3e-4b6f-8c3c-6205de5c111a\",\n\t/phase : 0.298583\n}, {\n\t/azim : 2.91887,\n\t/time : 0.866142,\n\t/pitch : 1.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_4f3a9e08-f76b-425b-83ec-cd547af81cc6\",\n\t/phase : 0.298583\n}, {\n\t/azim : 0.791559,\n\t/time : 0.866142,\n\t/pitch : 2.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_d95b67e8-ede7-4e58-b0de-64ea2133f31c\",\n\t/phase : 0.298583\n}, {\n\t/azim : 0.791559,\n\t/time : 0.866142,\n\t/pitch : 28.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_cc74583a-4a90-4c4f-8b7c-87b3d4f4d0dc\",\n\t/phase : 0.298583\n}, {\n\t/azim : 0.0494724,\n\t/time : 0.866142,\n\t/pitch : 118.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_a219bce2-e91c-402f-a443-47669dfa27a7\",\n\t/phase : 0.298583\n}, {\n\t/azim : 0.371043,\n\t/time : 0.866142,\n\t/pitch : 91.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_b6f515ee-86f9-4daf-a604-a438f45fc737\",\n\t/phase : 0.298583\n}, {\n\t/azim : 1.68206,\n\t/time : 0.866142,\n\t/pitch : 111.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_fd027a63-3498-4539-9517-233801f6d1fb\",\n\t/phase : 0.298583\n}, {\n\t/azim : 2.62204,\n\t/time : 0.866142,\n\t/pitch : 60.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_9723de0f-cd64-496a-90d8-4b5b84015ccf\",\n\t/phase : 0.298583\n}, {\n\t/azim : 3.11676,\n\t/time : 0.866142,\n\t/pitch : 117.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_c0d17be8-9a24-4785-8f02-040c16703e48\",\n\t/phase : 0.298583\n}, {\n\t/azim : 1.80574,\n\t/time : 0.866142,\n\t/pitch : 119.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_dd03210a-5514-4f72-a2cc-b2545b19acb2\",\n\t/phase : 0.298583\n}, {\n\t/azim : 3.11676,\n\t/time : 0.874016,\n\t/pitch : 73.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_4a1192ac-7b72-43f1-8d14-1c42cd453619\",\n\t/phase : 0.219843\n}, {\n\t/azim : 2.17679,\n\t/time : 0.874016,\n\t/pitch : 90.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_ecade6e7-98f8-4f08-84c9-fd26d4e00a36\",\n\t/phase : 0.219843\n}, {\n\t/azim : 2.84467,\n\t/time : 0.874016,\n\t/pitch : 98.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_c4adfc82-9475-40ef-8dad-63a87f4bb3dc\",\n\t/phase : 0.219843\n}, {\n\t/azim : 2.67151,\n\t/time : 0.874016,\n\t/pitch : 27.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_d1925ee2-c991-4250-8fb5-d9c6ddfcd73d\",\n\t/phase : 0.219843\n}, {\n\t/azim : 2.54783,\n\t/time : 0.874016,\n\t/pitch : 105.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_46751fe2-8cf4-4940-bf8c-d7429bd24d0f\",\n\t/phase : 0.219843\n}, {\n\t/azim : 2.07784,\n\t/time : 0.874016,\n\t/pitch : 111.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_7b8f19e2-4f37-4ec6-ac86-3b74994587c1\",\n\t/phase : 0.219843\n}, {\n\t/azim : 0.841031,\n\t/time : 0.874016,\n\t/pitch : 112.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_2d4c2d05-275f-4265-a356-a9eda82d37b2\",\n\t/phase : 0.219843\n}, {\n\t/azim : 2.72098,\n\t/time : 0.874016,\n\t/pitch : 114.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_78ba609e-955f-4fc2-ac27-75fb7799ff38\",\n\t/phase : 0.219843\n}, {\n\t/azim : 2.42415,\n\t/time : 0.874016,\n\t/pitch : 110.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_48c85a39-14a2-4474-b413-b5a80285ecf7\",\n\t/phase : 0.219843\n}, {\n\t/azim : 2.74572,\n\t/time : 0.874016,\n\t/pitch : 106.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_ea2ff00f-0dc4-46f1-a738-e810b616f3db\",\n\t/phase : 0.219843\n}, {\n\t/azim : 1.01419,\n\t/time : 0.874016,\n\t/pitch : 117.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_832d226f-aef8-4b3e-a86a-dc999ee7339c\",\n\t/phase : 0.219843\n}, {\n\t/azim : 2.07784,\n\t/time : 0.874016,\n\t/pitch : 38.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_67298eb9-b16e-400e-a25c-a55fcb119a5f\",\n\t/phase : 0.219843\n}, {\n\t/azim : 1.45944,\n\t/time : 0.874016,\n\t/pitch : 32.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_63472823-8851-4493-867a-2ea95de80d60\",\n\t/phase : 0.219843\n}, {\n\t/azim : 0.19789,\n\t/time : 0.874016,\n\t/pitch : 54.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_16220e9c-8111-467a-a29c-f883bdbbfdba\",\n\t/phase : 0.219843\n}, {\n\t/azim : 0.222626,\n\t/time : 0.88189,\n\t/pitch : 80.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_4f278b52-b472-4253-924a-d8bf6c1e0ca2\",\n\t/phase : 0.141103\n}, {\n\t/azim : 0.420516,\n\t/time : 0.88189,\n\t/pitch : 110.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_5e1384f6-fe19-478b-bc40-335795640937\",\n\t/phase : 0.141103\n}, {\n\t/azim : 0.766823,\n\t/time : 0.88189,\n\t/pitch : 71.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_47f309b9-ee44-422e-bef7-1fc40975c466\",\n\t/phase : 0.141103\n}, {\n\t/azim : 0.445252,\n\t/time : 0.88189,\n\t/pitch : 33.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_8c57e6a4-30af-40f3-9fe5-23b775207ab8\",\n\t/phase : 0.141103\n}, {\n\t/azim : 0.420516,\n\t/time : 0.88189,\n\t/pitch : 8.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_61b9831e-e413-45d4-9f09-ba21c4391087\",\n\t/phase : 0.141103\n}, {\n\t/azim : 1.83048,\n\t/time : 0.88189,\n\t/pitch : 45.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_7ccdc476-ba2a-4bcd-9924-6db46c87b255\",\n\t/phase : 0.141103\n}, {\n\t/azim : 2.99308,\n\t/time : 0.88189,\n\t/pitch : 68.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_04ea8837-f786-460c-8f46-acb3de5b3e1a\",\n\t/phase : 0.141103\n}, {\n\t/azim : 0.346307,\n\t/time : 0.88189,\n\t/pitch : 14.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_1b2cd706-6a1f-4a45-8685-a14c86bfc145\",\n\t/phase : 0.141103\n}, {\n\t/azim : 2.44889,\n\t/time : 0.88189,\n\t/pitch : 50.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_de874a9d-eb70-43a9-8ad7-e4ba0bf86ffe\",\n\t/phase : 0.141103\n}, {\n\t/azim : 2.02837,\n\t/time : 0.88189,\n\t/pitch : 28.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_149970c9-5f8c-4a6a-afaf-ddb0d2b865d2\",\n\t/phase : 0.141103\n}, {\n\t/azim : 0.568933,\n\t/time : 0.88189,\n\t/pitch : 38.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_da93a232-b88f-4712-b4c2-418e36f9e90e\",\n\t/phase : 0.141103\n}, {\n\t/azim : 2.37468,\n\t/time : 0.88189,\n\t/pitch : 106.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_e914b125-e1ee-491b-9311-8e79b4eb7ce6\",\n\t/phase : 0.141103\n}, {\n\t/azim : 0.173154,\n\t/time : 0.88189,\n\t/pitch : 16.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_2882133e-7718-47c9-8922-41fce2437a18\",\n\t/phase : 0.141103\n}, {\n\t/azim : 0.742087,\n\t/time : 0.88189,\n\t/pitch : 106.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_fa7368ff-32b8-4bc0-a0e1-31e90e40b38e\",\n\t/phase : 0.141103\n}, {\n\t/azim : 0.791559,\n\t/time : 0.88189,\n\t/pitch : 122.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_d50f6c4e-933c-4bba-a901-60ac64fc87d2\",\n\t/phase : 0.141103\n}, {\n\t/azim : 2.3252,\n\t/time : 0.88189,\n\t/pitch : 62.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_8640a70a-fcd0-4e7a-aa01-29f0f0470501\",\n\t/phase : 0.141103\n}, {\n\t/azim : 1.68206,\n\t/time : 0.88189,\n\t/pitch : 123.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_14e370db-2f91-436d-94c6-feaa69d7c92d\",\n\t/phase : 0.141103\n}, {\n\t/azim : 2.12732,\n\t/time : 0.88189,\n\t/pitch : 81.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_fc49ac1c-6454-4674-8d17-582a0e7a86f6\",\n\t/phase : 0.141103\n}, {\n\t/azim : 2.57257,\n\t/time : 0.88189,\n\t/pitch : 18.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_9e9b2704-84d7-49af-b576-7c2cd564a87c\",\n\t/phase : 0.141103\n}, {\n\t/azim : 1.48417,\n\t/time : 0.88189,\n\t/pitch : 4.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_e671f298-7fc7-4762-8e13-01bce7a55bf6\",\n\t/phase : 0.141103\n}, {\n\t/azim : 0.0989449,\n\t/time : 0.88189,\n\t/pitch : 79.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_58ecd619-e1b7-4851-86fa-dd633d74d17f\",\n\t/phase : 0.141103\n}, {\n\t/azim : 0.123681,\n\t/time : 0.88189,\n\t/pitch : 108.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_ed2c29b3-03a2-47bf-8a3b-987372773959\",\n\t/phase : 0.141103\n}, {\n\t/azim : 0.766823,\n\t/time : 0.88189,\n\t/pitch : 123.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_6c5a3e4b-cab8-42f6-83c3-24e7a319bfba\",\n\t/phase : 0.141103\n}, {\n\t/azim : 2.00363,\n\t/time : 0.889764,\n\t/pitch : 23.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_0dc3e820-99e7-405c-a5c1-75429cf26177\",\n\t/phase : 0.0623626\n}, {\n\t/azim : 1.33576,\n\t/time : 0.889764,\n\t/pitch : 22.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_58287c70-e5dd-4793-8bd2-8459b638c7df\",\n\t/phase : 0.0623626\n}, {\n\t/azim : 2.02837,\n\t/time : 0.889764,\n\t/pitch : 106.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_c78671e9-b9b7-4645-b186-b3bf313399ca\",\n\t/phase : 0.0623626\n}, {\n\t/azim : 0.420516,\n\t/time : 0.889764,\n\t/pitch : 108.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_f4f2dc20-d246-42c2-b67d-e63ec6f33a00\",\n\t/phase : 0.0623626\n}, {\n\t/azim : 0.568933,\n\t/time : 0.889764,\n\t/pitch : 31.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_d12d1707-19ea-425b-ad89-d9ae88fbbce3\",\n\t/phase : 0.0623626\n}, {\n\t/azim : 1.31102,\n\t/time : 0.889764,\n\t/pitch : 39.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_8039180f-fa21-423c-ae5d-b1b0a782967a\",\n\t/phase : 0.0623626\n}, {\n\t/azim : 1.58312,\n\t/time : 0.889764,\n\t/pitch : 121.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_baa0ae84-2e49-4542-a125-834a765c1b48\",\n\t/phase : 0.0623626\n}, {\n\t/azim : 2.30047,\n\t/time : 0.889764,\n\t/pitch : 20.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_16a754ff-61cb-4e6a-8c38-3864ce0b3d81\",\n\t/phase : 0.0623626\n}, {\n\t/azim : 2.69625,\n\t/time : 0.889764,\n\t/pitch : 32.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_c8ecb211-9bff-4455-b77f-98486dfc88e0\",\n\t/phase : 0.0623626\n}, {\n\t/azim : 0.816295,\n\t/time : 0.889764,\n\t/pitch : 26.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_b1cea837-92c4-4dfa-b296-6170b2e46676\",\n\t/phase : 0.0623626\n}]"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-8",
					"maxclass" : "newobj",
					"numinlets" : 1,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 411.0, 699.0, 133.0, 22.0 ],
					"text" : "udpreceive 7777 cnmat"
				}

			}
, 			{
				"box" : 				{
					"fontface" : 0,
					"fontsize" : 12.0,
					"id" : "obj-11",
					"linecount" : 7,
					"maxclass" : "o.compose",
					"numinlets" : 2,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 1127.0, 536.0, 150.0, 106.0 ],
					"saved_bundle_data" : [ 35, 98, 117, 110, 100, 108, 101, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16, 47, 107, 101, 121, 0, 0, 0, 0, 44, 115, 0, 0, 115, 118, 103, 0, 0, 0, 0, 104, 47, 118, 97, 108, 0, 0, 0, 0, 44, 46, 0, 0, 0, 0, 0, 88, 35, 98, 117, 110, 100, 108, 101, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20, 47, 110, 101, 119, 0, 0, 0, 0, 44, 115, 0, 0, 99, 105, 114, 99, 108, 101, 0, 0, 0, 0, 0, 12, 47, 99, 120, 0, 44, 105, 0, 0, 0, 0, 0, 100, 0, 0, 0, 12, 47, 99, 121, 0, 44, 105, 0, 0, 0, 0, 0, 100, 0, 0, 0, 12, 47, 114, 0, 0, 44, 105, 0, 0, 0, 0, 0, 10 ],
					"saved_bundle_length" : 144,
					"text" : "/key : \"svg\",\n/val : {\n\t/new : \"circle\",\n\t/cx : 100,\n\t/cy : 100,\n\t/r : 10\n}"
				}

			}
, 			{
				"box" : 				{
					"fontface" : 0,
					"fontsize" : 12.0,
					"id" : "obj-7",
					"linecount" : 7,
					"maxclass" : "o.compose",
					"numinlets" : 2,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ -68.0, 328.5, 150.0, 106.0 ],
					"saved_bundle_data" : [ 35, 98, 117, 110, 100, 108, 101, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16, 47, 107, 101, 121, 0, 0, 0, 0, 44, 115, 0, 0, 115, 118, 103, 0, 0, 0, 0, 104, 47, 118, 97, 108, 0, 0, 0, 0, 44, 46, 0, 0, 0, 0, 0, 88, 35, 98, 117, 110, 100, 108, 101, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20, 47, 110, 101, 119, 0, 0, 0, 0, 44, 115, 0, 0, 99, 105, 114, 99, 108, 101, 0, 0, 0, 0, 0, 12, 47, 99, 120, 0, 44, 105, 0, 0, 0, 0, 0, 100, 0, 0, 0, 12, 47, 99, 121, 0, 44, 105, 0, 0, 0, 0, 0, 100, 0, 0, 0, 12, 47, 114, 0, 0, 44, 105, 0, 0, 0, 0, 0, 10 ],
					"saved_bundle_length" : 144,
					"text" : "/key : \"svg\",\n/val : {\n\t/new : \"circle\",\n\t/cx : 100,\n\t/cy : 100,\n\t/r : 10\n}"
				}

			}
, 			{
				"box" : 				{
					"fontname" : "Arial",
					"fontsize" : 13.0,
					"id" : "obj-6",
					"linecount" : 2,
					"maxclass" : "newobj",
					"numinlets" : 1,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 130.0, 469.5, 95.0, 38.0 ],
					"text" : "dict.serialize @mode json"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-5",
					"maxclass" : "newobj",
					"numinlets" : 1,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 130.0, 426.5, 37.0, 22.0 ],
					"text" : "o.dict"
				}

			}
, 			{
				"box" : 				{
					"fontface" : 0,
					"fontsize" : 12.0,
					"id" : "obj-4",
					"linecount" : 3,
					"maxclass" : "o.compose",
					"numinlets" : 2,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 130.0, 361.5, 150.0, 51.0 ],
					"saved_bundle_data" : [ 35, 98, 117, 110, 100, 108, 101, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 52, 47, 102, 111, 111, 0, 0, 0, 0, 44, 46, 0, 0, 0, 0, 0, 36, 35, 98, 117, 110, 100, 108, 101, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16, 47, 98, 97, 114, 0, 0, 0, 0, 44, 105, 0, 0, 0, 0, 0, 2 ],
					"saved_bundle_length" : 72,
					"text" : "/foo : {\n\t/bar : 2\n}"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-3",
					"maxclass" : "button",
					"numinlets" : 1,
					"numoutlets" : 1,
					"outlettype" : [ "bang" ],
					"parameter_enable" : 0,
					"patching_rect" : [ 146.0, 314.5, 24.0, 24.0 ]
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-1",
					"maxclass" : "newobj",
					"numinlets" : 1,
					"numoutlets" : 0,
					"patching_rect" : [ 411.0, 661.0, 145.0, 22.0 ],
					"text" : "udpsend localhost 8888"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-64",
					"maxclass" : "message",
					"numinlets" : 2,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 559.0, 669.0, 103.0, 22.0 ],
					"text" : "maxqueuesize 0"
				}

			}
 ],
		"lines" : [ 			{
				"patchline" : 				{
					"destination" : [ "obj-9", 0 ],
					"source" : [ "obj-11", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-50", 0 ],
					"source" : [ "obj-12", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-1", 0 ],
					"order" : 1,
					"source" : [ "obj-17", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-28", 1 ],
					"order" : 0,
					"source" : [ "obj-17", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-20", 1 ],
					"source" : [ "obj-18", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-20", 0 ],
					"source" : [ "obj-19", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-17", 0 ],
					"source" : [ "obj-20", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-19", 2 ],
					"source" : [ "obj-21", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-23", 0 ],
					"source" : [ "obj-22", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-32", 0 ],
					"source" : [ "obj-23", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-35", 0 ],
					"source" : [ "obj-24", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-24", 0 ],
					"source" : [ "obj-25", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-32", 1 ],
					"source" : [ "obj-26", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-21", 0 ],
					"order" : 0,
					"source" : [ "obj-27", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-22", 0 ],
					"order" : 1,
					"source" : [ "obj-27", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-25", 0 ],
					"order" : 2,
					"source" : [ "obj-27", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-27", 0 ],
					"source" : [ "obj-29", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-29", 1 ],
					"source" : [ "obj-30", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-29", 0 ],
					"source" : [ "obj-31", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-19", 1 ],
					"source" : [ "obj-32", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-37", 1 ],
					"source" : [ "obj-33", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-33", 0 ],
					"source" : [ "obj-34", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-19", 0 ],
					"source" : [ "obj-35", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-34", 0 ],
					"source" : [ "obj-36", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-50", 0 ],
					"source" : [ "obj-38", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-38", 0 ],
					"source" : [ "obj-39", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-5", 0 ],
					"source" : [ "obj-4", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-39", 0 ],
					"source" : [ "obj-41", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-41", 0 ],
					"source" : [ "obj-43", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-45", 0 ],
					"source" : [ "obj-44", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-45", 0 ],
					"source" : [ "obj-48", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-45", 0 ],
					"source" : [ "obj-49", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-6", 0 ],
					"source" : [ "obj-5", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-1", 0 ],
					"source" : [ "obj-50", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-51", 1 ],
					"source" : [ "obj-50", 1 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-55", 0 ],
					"source" : [ "obj-51", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-51", 0 ],
					"source" : [ "obj-53", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-56", 0 ],
					"source" : [ "obj-55", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-41", 0 ],
					"source" : [ "obj-57", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-57", 0 ],
					"source" : [ "obj-59", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-57", 0 ],
					"source" : [ "obj-60", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-63", 1 ],
					"source" : [ "obj-61", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-63", 0 ],
					"source" : [ "obj-62", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-43", 0 ],
					"source" : [ "obj-63", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-8", 0 ],
					"source" : [ "obj-64", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-5", 0 ],
					"source" : [ "obj-7", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-53", 0 ],
					"order" : 0,
					"source" : [ "obj-8", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-66", 1 ],
					"order" : 1,
					"source" : [ "obj-8", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-1", 0 ],
					"source" : [ "obj-9", 0 ]
				}

			}
 ],
		"dependency_cache" : [ 			{
				"name" : "o.compose.mxo",
				"type" : "iLaX"
			}
, 			{
				"name" : "o.dict.mxo",
				"type" : "iLaX"
			}
, 			{
				"name" : "o.display.mxo",
				"type" : "iLaX"
			}
, 			{
				"name" : "o.flatten.mxo",
				"type" : "iLaX"
			}
, 			{
				"name" : "o.pack.mxo",
				"type" : "iLaX"
			}
, 			{
				"name" : "o.union.mxo",
				"type" : "iLaX"
			}
, 			{
				"name" : "o.expr.codebox.mxo",
				"type" : "iLaX"
			}
, 			{
				"name" : "o.printbytes.mxo",
				"type" : "iLaX"
			}
, 			{
				"name" : "bench.mxo",
				"type" : "iLaX"
			}
 ],
		"autosave" : 0
	}

}
