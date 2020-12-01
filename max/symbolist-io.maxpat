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
		"rect" : [ 182.0, 79.0, 1011.0, 703.0 ],
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
					"saved_bundle_data" : [ 35, 98, 117, 110, 100, 108, 101, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -32, 47, 118, 97, 108, 0, 0, 0, 0, 44, 46, 0, 0, 0, 0, 0, -48, 35, 98, 117, 110, 100, 108, 101, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20, 47, 97, 122, 105, 109, 0, 0, 0, 44, 100, 0, 0, 63, -15, -49, 97, 96, 0, 0, 0, 0, 0, 0, 20, 47, 116, 105, 109, 101, 0, 0, 0, 44, 100, 0, 0, 63, -20, -71, 114, -32, 0, 0, 0, 0, 0, 0, 16, 47, 112, 105, 116, 99, 104, 0, 0, 44, 105, 0, 0, 0, 0, 0, 50, 0, 0, 0, 24, 47, 100, 117, 114, 97, 116, 105, 111, 110, 0, 0, 0, 44, 100, 0, 0, 63, -71, -103, -103, -103, -103, -103, -102, 0, 0, 0, 36, 47, 99, 108, 97, 115, 115, 0, 0, 44, 115, 0, 0, 114, 101, 99, 116, 97, 110, 103, 108, 101, 83, 116, 97, 118, 101, 65, 122, 105, 109, 117, 116, 104, 0, 0, 0, 0, 0, 0, 32, 47, 99, 111, 110, 116, 97, 105, 110, 101, 114, 0, 0, 44, 115, 0, 0, 114, 101, 99, 116, 97, 110, 103, 108, 101, 83, 116, 97, 118, 101, 0, 0, 0, 0, 0, 16, 47, 97, 109, 112, 0, 0, 0, 0, 44, 105, 0, 0, 0, 0, 0, 1, 0, 0, 0, 20, 47, 107, 101, 121, 0, 0, 0, 0, 44, 115, 0, 0, 100, 97, 116, 97, 0, 0, 0, 0 ],
					"saved_bundle_length" : 268,
					"text" : "/val : {\n\t/azim : 1.11313,\n\t/time : 0.897638,\n\t/pitch : 50,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1\n},\n/key : \"data\""
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
					"linecount" : 481,
					"maxclass" : "o.display",
					"numinlets" : 1,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ -136.5, 482.5, 551.0, 6559.0 ],
					"text" : "/lookup : [{\n\t/azim : 0.39578,\n\t/time : 0.23622,\n\t/pitch : 66.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_997429d6-cc12-4551-9dce-481eca54ef90\",\n\t/phase : 0.937795\n}, {\n\t/azim : 3.06729,\n\t/time : 0.23622,\n\t/pitch : 68.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_79991bfe-9fb9-427d-a0c8-82f1765f1db1\",\n\t/phase : 0.937795\n}, {\n\t/azim : 2.251,\n\t/time : 0.23622,\n\t/pitch : 32.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_3a9a0b2e-7931-4284-badd-5ac647495b08\",\n\t/phase : 0.937795\n}, {\n\t/azim : 0.321571,\n\t/time : 0.244094,\n\t/pitch : 2.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_e263079b-97bc-4680-964a-47b7eb189e08\",\n\t/phase : 0.859055\n}, {\n\t/azim : 0.692614,\n\t/time : 0.244094,\n\t/pitch : 117.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_4d63683f-3428-417a-b999-4c062347c90d\",\n\t/phase : 0.859055\n}, {\n\t/azim : 2.49836,\n\t/time : 0.244094,\n\t/pitch : 43.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_10268e51-4a1e-44e0-9d15-93fdf0f5c9da\",\n\t/phase : 0.859055\n}, {\n\t/azim : 2.94361,\n\t/time : 0.251969,\n\t/pitch : 57.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_7e5366e3-5f15-46e3-bd83-3cab1e240e30\",\n\t/phase : 0.780315\n}, {\n\t/azim : 1.28628,\n\t/time : 0.251969,\n\t/pitch : 48.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_a0c9563a-2fe0-41b2-9a2a-3b871d6a1e1f\",\n\t/phase : 0.780315\n}, {\n\t/azim : 1.90469,\n\t/time : 0.251969,\n\t/pitch : 104.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_c571b9d5-558c-407c-bce7-ea55f7fdfdd0\",\n\t/phase : 0.780315\n}, {\n\t/azim : 1.92943,\n\t/time : 0.251969,\n\t/pitch : 99.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_28453992-3b0f-4cda-9c0a-2a9a53195c93\",\n\t/phase : 0.780315\n}, {\n\t/azim : 1.40996,\n\t/time : 0.251969,\n\t/pitch : 47.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_223b7cb3-2c3e-4feb-8b6f-f602b9e92e33\",\n\t/phase : 0.780315\n}, {\n\t/azim : 1.92943,\n\t/time : 0.251969,\n\t/pitch : 32.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_6ab2beee-be0d-4ee7-9a87-043ca909b6f3\",\n\t/phase : 0.780315\n}, {\n\t/azim : 1.18734,\n\t/time : 0.259843,\n\t/pitch : 19.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_97f864c1-eacc-4bab-af02-67cf9a3cc971\",\n\t/phase : 0.701575\n}, {\n\t/azim : 1.92943,\n\t/time : 0.259843,\n\t/pitch : 99.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_c09f7809-3a29-4c4d-abfe-bb2f7b18fa9a\",\n\t/phase : 0.701575\n}, {\n\t/azim : 1.4347,\n\t/time : 0.259843,\n\t/pitch : 39.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_60b2c22f-d62c-4ae3-aebf-15aae2d9b2f5\",\n\t/phase : 0.701575\n}, {\n\t/azim : 0.890504,\n\t/time : 0.259843,\n\t/pitch : 71.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_2961f194-f185-45c7-9144-cd63cb2b9d63\",\n\t/phase : 0.701575\n}, {\n\t/azim : 0.989449,\n\t/time : 0.267717,\n\t/pitch : 46.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_57482c39-3e3f-442f-8704-f1c3114f80a0\",\n\t/phase : 0.622835\n}, {\n\t/azim : 0.19789,\n\t/time : 0.267717,\n\t/pitch : 33.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_9a43bae0-6614-4ae9-91bb-f15248890d85\",\n\t/phase : 0.622835\n}, {\n\t/azim : 2.89414,\n\t/time : 0.267717,\n\t/pitch : 14.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_55083ef6-9eda-47e2-924a-bb4c35a3dd0b\",\n\t/phase : 0.622835\n}, {\n\t/azim : 1.87995,\n\t/time : 0.267717,\n\t/pitch : 13.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_187bc467-2a67-4e31-bc23-c72a2adad9fc\",\n\t/phase : 0.622835\n}, {\n\t/azim : 1.85522,\n\t/time : 0.275591,\n\t/pitch : 15.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_7c8c2378-fa5b-4286-bb51-deb3acd1db64\",\n\t/phase : 0.544095\n}, {\n\t/azim : 0.890504,\n\t/time : 0.275591,\n\t/pitch : 61.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_c9ead984-5591-42c0-82cf-c6c08e1074b5\",\n\t/phase : 0.544095\n}, {\n\t/azim : 1.50891,\n\t/time : 0.275591,\n\t/pitch : 127.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_3f04d4a0-b9c7-44a3-b9c0-94b75d03ab7a\",\n\t/phase : 0.544095\n}, {\n\t/azim : 2.84467,\n\t/time : 0.275591,\n\t/pitch : 41.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_f879a83f-7c30-4363-b9bf-34099b9d1673\",\n\t/phase : 0.544095\n}, {\n\t/azim : 1.58312,\n\t/time : 0.275591,\n\t/pitch : 106.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_dd79acd4-c5b3-4f92-9147-c61242a222bf\",\n\t/phase : 0.544095\n}, {\n\t/azim : 1.53365,\n\t/time : 0.275591,\n\t/pitch : 71.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_e0641f70-081c-4d3d-8077-8000f7c82a4c\",\n\t/phase : 0.544095\n}, {\n\t/azim : 2.3252,\n\t/time : 0.275591,\n\t/pitch : 69.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_865aab4b-84e6-4143-8134-63ed8506a14c\",\n\t/phase : 0.544095\n}, {\n\t/azim : 2.81993,\n\t/time : 0.275591,\n\t/pitch : 17.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_838a734b-00d5-49ec-b711-079c194d5df6\",\n\t/phase : 0.544095\n}, {\n\t/azim : 0.39578,\n\t/time : 0.275591,\n\t/pitch : 114.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_ee236e17-6378-4ac7-917d-49906eab80ac\",\n\t/phase : 0.544095\n}, {\n\t/azim : 0.667878,\n\t/time : 0.283465,\n\t/pitch : 45.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_56a6a5a5-e26c-497f-9eb2-2ff50c682931\",\n\t/phase : 0.465354\n}, {\n\t/azim : 1.23681,\n\t/time : 0.283465,\n\t/pitch : 110.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_00cd4e26-d57c-4d28-a72c-e85a0e562b99\",\n\t/phase : 0.465354\n}, {\n\t/azim : 3.01782,\n\t/time : 0.291339,\n\t/pitch : 30.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_71aaae37-6fbe-4afc-a3a9-1028fd2d0afe\",\n\t/phase : 0.386614\n}, {\n\t/azim : 2.30047,\n\t/time : 0.299213,\n\t/pitch : 94.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_92545f04-9482-4192-8680-5dbaa763e835\",\n\t/phase : 0.307874\n}, {\n\t/azim : 2.84467,\n\t/time : 0.299213,\n\t/pitch : 93.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_d35f6d50-cda1-4a97-8f78-469bc7c4adbf\",\n\t/phase : 0.307874\n}, {\n\t/azim : 0.71735,\n\t/time : 0.299213,\n\t/pitch : 61.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_55afc109-ab98-4c80-bdc7-9f33321497c1\",\n\t/phase : 0.307874\n}, {\n\t/azim : 1.95416,\n\t/time : 0.299213,\n\t/pitch : 10.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_5d86cc43-d1bc-4cb2-a72d-81c6270c922a\",\n\t/phase : 0.307874\n}, {\n\t/azim : 1.03892,\n\t/time : 0.307087,\n\t/pitch : 26.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_bf21884c-84be-4f9d-ad58-86eb668439fb\",\n\t/phase : 0.229134\n}, {\n\t/azim : 2.77046,\n\t/time : 0.307087,\n\t/pitch : 42.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_0c997ec8-ce07-4602-ba9e-5eab9a7f3fc6\",\n\t/phase : 0.229134\n}, {\n\t/azim : 1.36049,\n\t/time : 0.307087,\n\t/pitch : 36.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_fc444578-bc8b-43c2-a72c-cb1215da0f57\",\n\t/phase : 0.229134\n}, {\n\t/azim : 0.568933,\n\t/time : 0.314961,\n\t/pitch : 15.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_3b61a1d9-dcfb-42f2-8659-e37748d928d1\",\n\t/phase : 0.150394\n}, {\n\t/azim : 2.69625,\n\t/time : 0.314961,\n\t/pitch : 53.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_5a08a5de-5e2a-4310-996e-19961e7f5988\",\n\t/phase : 0.150394\n}, {\n\t/azim : 2.3252,\n\t/time : 0.314961,\n\t/pitch : 8.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_6411f5e6-ea30-4a84-9a0b-2c6e68041364\",\n\t/phase : 0.150394\n}, {\n\t/azim : 3.06729,\n\t/time : 0.314961,\n\t/pitch : 93.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_54d09664-4697-454b-93e5-c687cfd4305a\",\n\t/phase : 0.150394\n}, {\n\t/azim : 0.692614,\n\t/time : 0.322835,\n\t/pitch : 102.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_ee2fa0b5-bad6-4831-a42d-6efd86ac7d90\",\n\t/phase : 0.0716537\n}, {\n\t/azim : 0.148417,\n\t/time : 0.322835,\n\t/pitch : 18.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_8eb6a0c3-ddd4-4c91-8fa0-73a29fe73e7e\",\n\t/phase : 0.0716537\n}, {\n\t/azim : 2.57257,\n\t/time : 0.322835,\n\t/pitch : 56.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_48131535-f8a0-4b41-87e6-2e386cd56162\",\n\t/phase : 0.0716537\n}, {\n\t/azim : 0.791559,\n\t/time : 0.322835,\n\t/pitch : 44.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_3b31c88c-893c-423c-98ac-c49db3678852\",\n\t/phase : 0.0716537\n}, {\n\t/azim : 2.251,\n\t/time : 0.322835,\n\t/pitch : 86.,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"rectangleStave\",\n\t/amp : 1.,\n\t/id : \"rectangleStaveAzimuth_u_9575b590-375d-4b39-940a-2511832590af\",\n\t/phase : 0.0716537\n}]"
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
