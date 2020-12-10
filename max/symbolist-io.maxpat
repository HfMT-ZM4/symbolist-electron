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
		"rect" : [ 359.0, 79.0, 1612.0, 937.0 ],
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
					"id" : "obj-67",
					"maxclass" : "message",
					"numinlets" : 2,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 469.0, 376.0, 54.0, 22.0 ],
					"text" : "trio"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-65",
					"maxclass" : "message",
					"numinlets" : 2,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 469.0, 334.5, 54.0, 22.0 ],
					"text" : "basson"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-58",
					"maxclass" : "message",
					"numinlets" : 2,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 404.0, 361.5, 47.0, 22.0 ],
					"text" : "synth"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-54",
					"maxclass" : "message",
					"numinlets" : 2,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 404.0, 334.5, 54.0, 22.0 ],
					"presentation_linecount" : 2,
					"text" : "bassoon"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-52",
					"maxclass" : "message",
					"numinlets" : 2,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 404.0, 303.0, 35.0, 22.0 ],
					"text" : "oboe"
				}

			}
, 			{
				"box" : 				{
					"fontface" : 0,
					"fontsize" : 12.0,
					"id" : "obj-42",
					"linecount" : 3,
					"maxclass" : "o.compose",
					"numinlets" : 2,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 1205.5, 305.5, 309.0, 51.0 ],
					"presentation_linecount" : 3,
					"saved_bundle_data" : [ 35, 98, 117, 110, 100, 108, 101, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 36, 47, 99, 108, 97, 115, 115, 0, 0, 44, 115, 0, 0, 114, 101, 99, 116, 97, 110, 103, 108, 101, 83, 116, 97, 118, 101, 65, 122, 105, 109, 117, 116, 104, 0, 0, 0, 0, 0, 0, 24, 47, 99, 111, 110, 116, 97, 105, 110, 101, 114, 0, 0, 44, 115, 0, 0, 115, 121, 110, 116, 104, 0, 0, 0, 0, 0, 0, 16, 47, 97, 109, 112, 0, 0, 0, 0, 44, 105, 0, 0, 0, 0, 0, 1 ],
					"saved_bundle_length" : 104,
					"text" : "/class : \"rectangleStaveAzimuth\",\n/container : \"synth\",\n/amp : 1"
				}

			}
, 			{
				"box" : 				{
					"fontface" : 0,
					"fontsize" : 12.0,
					"id" : "obj-21",
					"linecount" : 3,
					"maxclass" : "o.compose",
					"numinlets" : 2,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 1040.5, 193.0, 309.0, 51.0 ],
					"presentation_linecount" : 3,
					"saved_bundle_data" : [ 35, 98, 117, 110, 100, 108, 101, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 36, 47, 99, 108, 97, 115, 115, 0, 0, 44, 115, 0, 0, 114, 101, 99, 116, 97, 110, 103, 108, 101, 83, 116, 97, 118, 101, 65, 122, 105, 109, 117, 116, 104, 0, 0, 0, 0, 0, 0, 24, 47, 99, 111, 110, 116, 97, 105, 110, 101, 114, 0, 0, 44, 115, 0, 0, 98, 97, 115, 115, 111, 111, 110, 0, 0, 0, 0, 16, 47, 97, 109, 112, 0, 0, 0, 0, 44, 105, 0, 0, 0, 0, 0, 1 ],
					"saved_bundle_length" : 104,
					"text" : "/class : \"rectangleStaveAzimuth\",\n/container : \"bassoon\",\n/amp : 1"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-13",
					"maxclass" : "newobj",
					"numinlets" : 2,
					"numoutlets" : 1,
					"outlettype" : [ "int" ],
					"patching_rect" : [ 820.0, 193.0, 73.0, 22.0 ],
					"text" : "random 128"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-10",
					"maxclass" : "newobj",
					"numinlets" : 1,
					"numoutlets" : 1,
					"outlettype" : [ "bang" ],
					"patching_rect" : [ 906.0, 219.0, 100.0, 22.0 ],
					"text" : "loadbang"
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-40",
					"maxclass" : "button",
					"numinlets" : 1,
					"numoutlets" : 1,
					"outlettype" : [ "bang" ],
					"parameter_enable" : 0,
					"patching_rect" : [ 608.0, 122.0, 24.0, 24.0 ]
				}

			}
, 			{
				"box" : 				{
					"id" : "obj-66",
					"linecount" : 2,
					"maxclass" : "message",
					"numinlets" : 2,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 193.0, 715.0, 177.0, 35.0 ],
					"text" : "FullPacket 3936 140719936921616"
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
					"patching_rect" : [ 142.0, 28.0, 172.0, 65.0 ],
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
					"patching_rect" : [ 275.0, 229.0, 24.0, 24.0 ]
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
					"numinlets" : 2,
					"numoutlets" : 1,
					"outlettype" : [ "FullPacket" ],
					"patching_rect" : [ 304.0, 434.0, 119.0, 22.0 ],
					"text" : "o.pack /time /id oboe"
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
					"patching_rect" : [ 750.0, 193.0, 50.0, 22.0 ]
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
					"patching_rect" : [ 1342.0, 93.0, 309.0, 38.0 ],
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
					"text" : "* 1."
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
					"saved_bundle_data" : [ 35, 98, 117, 110, 100, 108, 101, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -40, 47, 118, 97, 108, 0, 0, 0, 0, 44, 46, 0, 0, 0, 0, 0, -56, 35, 98, 117, 110, 100, 108, 101, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20, 47, 97, 122, 105, 109, 0, 0, 0, 44, 100, 0, 0, 64, 0, 7, 113, 64, 0, 0, 0, 0, 0, 0, 20, 47, 116, 105, 109, 101, 0, 0, 0, 44, 100, 0, 0, 63, -32, -95, 66, -128, 0, 0, 0, 0, 0, 0, 16, 47, 112, 105, 116, 99, 104, 0, 0, 44, 105, 0, 0, 0, 0, 0, 8, 0, 0, 0, 24, 47, 100, 117, 114, 97, 116, 105, 111, 110, 0, 0, 0, 44, 100, 0, 0, 63, -71, -103, -103, -103, -103, -103, -102, 0, 0, 0, 36, 47, 99, 108, 97, 115, 115, 0, 0, 44, 115, 0, 0, 114, 101, 99, 116, 97, 110, 103, 108, 101, 83, 116, 97, 118, 101, 65, 122, 105, 109, 117, 116, 104, 0, 0, 0, 0, 0, 0, 24, 47, 99, 111, 110, 116, 97, 105, 110, 101, 114, 0, 0, 44, 115, 0, 0, 115, 121, 110, 116, 104, 0, 0, 0, 0, 0, 0, 16, 47, 97, 109, 112, 0, 0, 0, 0, 44, 105, 0, 0, 0, 0, 0, 1, 0, 0, 0, 20, 47, 107, 101, 121, 0, 0, 0, 0, 44, 115, 0, 0, 100, 97, 116, 97, 0, 0, 0, 0 ],
					"saved_bundle_length" : 260,
					"text" : "/val : {\n\t/azim : 2.00363,\n\t/time : 0.519685,\n\t/pitch : 8,\n\t/duration : 0.1,\n\t/class : \"rectangleStaveAzimuth\",\n\t/container : \"synth\",\n\t/amp : 1\n},\n/key : \"data\""
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
					"patching_rect" : [ 636.0, 277.5, 233.0, 22.0 ],
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
					"patching_rect" : [ 906.0, 270.0, 309.0, 51.0 ],
					"saved_bundle_data" : [ 35, 98, 117, 110, 100, 108, 101, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 36, 47, 99, 108, 97, 115, 115, 0, 0, 44, 115, 0, 0, 114, 101, 99, 116, 97, 110, 103, 108, 101, 83, 116, 97, 118, 101, 65, 122, 105, 109, 117, 116, 104, 0, 0, 0, 0, 0, 0, 24, 47, 99, 111, 110, 116, 97, 105, 110, 101, 114, 0, 0, 44, 115, 0, 0, 111, 98, 111, 101, 0, 0, 0, 0, 0, 0, 0, 16, 47, 97, 109, 112, 0, 0, 0, 0, 44, 105, 0, 0, 0, 0, 0, 1 ],
					"saved_bundle_length" : 104,
					"text" : "/class : \"rectangleStaveAzimuth\",\n/container : \"oboe\",\n/amp : 1"
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
					"linecount" : 129,
					"maxclass" : "o.display",
					"numinlets" : 1,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 23.0, 537.0, 551.0, 1774.0 ],
					"text" : "/lookup : {\n\t/trio : [{\n\t\t/oboe : [{\n\t\t\t/azim : 2.00363,\n\t\t\t/time : 0.574803,\n\t\t\t/pitch : 122.,\n\t\t\t/duration : 0.1,\n\t\t\t/class : \"rectangleStaveAzimuth\",\n\t\t\t/container : \"oboe\",\n\t\t\t/amp : 1.,\n\t\t\t/id : \"rectangleStaveAzimuth_u_6d77301a-f374-4d54-80c8-6b2c960d4f73\",\n\t\t\t/phase : 0.651968\n\t\t}, {\n\t\t\t/azim : 3.04256,\n\t\t\t/time : 0.629921,\n\t\t\t/pitch : 98.,\n\t\t\t/duration : 0.1,\n\t\t\t/class : \"rectangleStaveAzimuth\",\n\t\t\t/container : \"oboe\",\n\t\t\t/amp : 1.,\n\t\t\t/id : \"rectangleStaveAzimuth_u_c4f48958-ed33-4e81-91a2-a84db98fa412\",\n\t\t\t/phase : 0.100787\n\t\t}, {\n\t\t\t/azim : 0.544197,\n\t\t\t/time : 0.543307,\n\t\t\t/pitch : 127.,\n\t\t\t/duration : 0.1,\n\t\t\t/class : \"rectangleStaveAzimuth\",\n\t\t\t/container : \"oboe\",\n\t\t\t/amp : 1.,\n\t\t\t/id : \"rectangleStaveAzimuth_u_23aaf40a-e28a-425e-8c64-2a1d833a4576\",\n\t\t\t/phase : 0.966929\n\t\t}, {\n\t\t\t/azim : 0.618406,\n\t\t\t/time : 0.598425,\n\t\t\t/pitch : 44.,\n\t\t\t/duration : 0.1,\n\t\t\t/class : \"rectangleStaveAzimuth\",\n\t\t\t/container : \"oboe\",\n\t\t\t/amp : 1.,\n\t\t\t/id : \"rectangleStaveAzimuth_u_4f5e9636-7e87-4f41-9ac0-20161ca4bce5\",\n\t\t\t/phase : 0.415748\n\t\t}]\n\t}, {\n\t\t/bassoon : [{\n\t\t\t/azim : 1.08839,\n\t\t\t/time : 0.559055,\n\t\t\t/pitch : 115.,\n\t\t\t/duration : 0.1,\n\t\t\t/class : \"rectangleStaveAzimuth\",\n\t\t\t/container : \"bassoon\",\n\t\t\t/amp : 1.,\n\t\t\t/id : \"rectangleStaveAzimuth_u_13275a48-d5d3-4447-8a1d-e65228cc90ac\",\n\t\t\t/phase : 0.809449\n\t\t}, {\n\t\t\t/azim : 1.83048,\n\t\t\t/time : 0.629921,\n\t\t\t/pitch : 62.,\n\t\t\t/duration : 0.1,\n\t\t\t/class : \"rectangleStaveAzimuth\",\n\t\t\t/container : \"bassoon\",\n\t\t\t/amp : 1.,\n\t\t\t/id : \"rectangleStaveAzimuth_u_5ec27d37-9f6e-44a4-9861-bd94360a5daf\",\n\t\t\t/phase : 0.100787\n\t\t}, {\n\t\t\t/azim : 0.222626,\n\t\t\t/time : 0.559055,\n\t\t\t/pitch : 40.,\n\t\t\t/duration : 0.1,\n\t\t\t/class : \"rectangleStaveAzimuth\",\n\t\t\t/container : \"bassoon\",\n\t\t\t/amp : 1.,\n\t\t\t/id : \"rectangleStaveAzimuth_u_0c56da2a-2f9d-4abb-b45b-a575e51ff1ea\",\n\t\t\t/phase : 0.809449\n\t\t}, {\n\t\t\t/azim : 1.92943,\n\t\t\t/time : 0.559055,\n\t\t\t/pitch : 98.,\n\t\t\t/duration : 0.1,\n\t\t\t/class : \"rectangleStaveAzimuth\",\n\t\t\t/container : \"bassoon\",\n\t\t\t/amp : 1.,\n\t\t\t/id : \"rectangleStaveAzimuth_u_be5f956d-5109-482c-82fd-f8781462a11a\",\n\t\t\t/phase : 0.809449\n\t\t}, {\n\t\t\t/azim : 1.48417,\n\t\t\t/time : 0.551181,\n\t\t\t/pitch : 55.,\n\t\t\t/duration : 0.1,\n\t\t\t/class : \"rectangleStaveAzimuth\",\n\t\t\t/container : \"bassoon\",\n\t\t\t/amp : 1.,\n\t\t\t/id : \"rectangleStaveAzimuth_u_4745a51b-f686-4fee-b8a3-d0e79f306d83\",\n\t\t\t/phase : 0.888189\n\t\t}, {\n\t\t\t/azim : 0.371043,\n\t\t\t/time : 0.559055,\n\t\t\t/pitch : 27.,\n\t\t\t/duration : 0.1,\n\t\t\t/class : \"rectangleStaveAzimuth\",\n\t\t\t/container : \"bassoon\",\n\t\t\t/amp : 1.,\n\t\t\t/id : \"rectangleStaveAzimuth_u_ca7e4391-0a70-4fa6-aab7-2e55439b962a\",\n\t\t\t/phase : 0.809449\n\t\t}]\n\t}, {\n\t\t/synth : [{\n\t\t\t/azim : 1.26155,\n\t\t\t/time : 0.637795,\n\t\t\t/pitch : 23.,\n\t\t\t/duration : 0.1,\n\t\t\t/class : \"rectangleStaveAzimuth\",\n\t\t\t/container : \"synth\",\n\t\t\t/amp : 1.,\n\t\t\t/id : \"rectangleStaveAzimuth_u_3135680e-4d07-44b9-862b-33e45fdf1b34\",\n\t\t\t/phase : 0.0220472\n\t\t}, {\n\t\t\t/azim : 1.7068,\n\t\t\t/time : 0.606299,\n\t\t\t/pitch : 15.,\n\t\t\t/duration : 0.1,\n\t\t\t/class : \"rectangleStaveAzimuth\",\n\t\t\t/container : \"synth\",\n\t\t\t/amp : 1.,\n\t\t\t/id : \"rectangleStaveAzimuth_u_fd29101f-ad3d-4649-b50f-5add997da9a1\",\n\t\t\t/phase : 0.337008\n\t\t}]\n\t}]\n}"
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
					"patching_rect" : [ 411.0, 669.0, 145.0, 22.0 ],
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
					"destination" : [ "obj-18", 0 ],
					"source" : [ "obj-10", 0 ]
				}

			}
, 			{
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
					"destination" : [ "obj-19", 2 ],
					"source" : [ "obj-13", 0 ]
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
					"destination" : [ "obj-20", 1 ],
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
					"destination" : [ "obj-13", 0 ],
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
					"destination" : [ "obj-25", 0 ],
					"source" : [ "obj-40", 0 ]
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
					"destination" : [ "obj-20", 1 ],
					"source" : [ "obj-42", 0 ]
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
					"destination" : [ "obj-39", 1 ],
					"source" : [ "obj-52", 0 ]
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
					"destination" : [ "obj-39", 1 ],
					"source" : [ "obj-54", 0 ]
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
					"destination" : [ "obj-39", 1 ],
					"source" : [ "obj-58", 0 ]
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
					"destination" : [ "obj-39", 1 ],
					"source" : [ "obj-65", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-39", 1 ],
					"source" : [ "obj-67", 0 ]
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
					"destination" : [ "obj-2", 0 ],
					"order" : 2,
					"source" : [ "obj-8", 0 ]
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
