/* March Madness 2027 data. Snapshot as of Nov 21, 2026.
   Update this file to refresh the page; madness.js renders from it. */
window.MM_DATA = (function () {
  "use strict";
  var FOLLOW = {
    "Villanova": { c1: "#00205b", c2: "#13b5ea" },
    "Penn State": { c1: "#1e407c", c2: "#96bee6" },
    "Denver": { c1: "#8b2332", c2: "#b59a57" },
    "Michigan": { c1: "#00274c", c2: "#ffcb05" },
    "Ohio State": { c1: "#bb0000", c2: "#8a8f98" }
  };

  /* Your five teams. Villanova, Michigan and Ohio State match the Top 50 table; Penn State and Denver come from Torvik team pages. */
  var TEAMS = [
    { name: "Villanova", conf: "Big East", wl: "3-2", trank: 41, oe: 117.0, de: 99.8, wab: -0.9, seed: 9.2, any: 49.4, auto: 5.5, proj: "17-14 (10-10)",
      next: [["Sat 11/21", "vs Michigan", 51], ["Tue 11/24", "vs Coppin St.", 99], ["Fri 11/27", "at Kansas", 15]],
      note: "Hosts Michigan today, the return half of last year's home-and-home. 3-2 with losses to Notre Dame (74-72, neutral site) and at Pittsburgh (81-61). Torvik gives it roughly even odds of making the field, the biggest swing of your five teams. Opponents shoot only 41.9% on twos against it (23rd), but its free-throw rate is 320th. Bigger tests ahead: Wisconsin 12/12 (neutral) and at Creighton 12/19." },
    { name: "Penn State", conf: "Big Ten", wl: "5-1", trank: 94, oe: 113.7, de: 105.7, wab: -0.4, seed: 11.4, any: 4.0, auto: 0.2, proj: "15-16 (6-14)",
      next: [["Wed 11/25", "vs Memphis (neutral)", 47], ["Tue 12/1", "vs Albany", 95], ["Tue 12/8", "vs Nebraska", 24]],
      note: "5-1; the only loss was 82-76 to Pitt at the Palestra. Offense is solid (113.7) but defense (105.7, 133rd) holds it back. Torvik projects 15-16 (6-14 Big Ten) and about a 4% chance of any bid, so it needs early wins over Memphis, Nebraska or at Illinois (12/12) to change the picture. Gets to the line more than almost anyone (free-throw rate 62.3, 3rd nationally). Ivan Juric (7-0 sophomore) leads in usage at 28.2%. Plays Ohio State 1/17 and 2/6, Michigan 2/23." },
    { name: "Denver", conf: "West Coast", wl: "1-3", trank: 267, oe: 103.9, de: 112.5, wab: -2.1, seed: 15.6, any: 0.2, auto: 0.2, proj: "9-23 (4-12)",
      next: [["Sat 11/21", "at Eastern Michigan", 17], ["Mon 11/23", "at Kansas", 1], ["Sat 11/28", "at New Mexico St.", 21]],
      note: "First season in the West Coast Conference. 1-3: lost at Wisconsin 75-68, at UC Riverside 64-60 and at home to Wyoming 76-53, then beat UC Colorado Springs 101-63. Torvik ranks the offense 239th and defense 302nd. The realistic route is winning the WCC tournament for the automatic bid (Torvik: 0.2%). Torvik projects 9-23 (4-12 WCC) and a seed of about 15.6 in the rare case it gets in." },
    { name: "Michigan", conf: "Big Ten", wl: "3-1", trank: 17, oe: 119.1, de: 96.6, wab: 0.35, seed: 5.4, any: 89, auto: 8.6, proj: "20-10 (12-8)",
      next: [["Sat 11/21", "at Villanova", 49], ["Tue 11/24", "vs Creighton (neutral)", 67], ["Tue 12/1", "vs Mississippi Valley St.", 99]],
      note: "Plays at Villanova today, a near coin flip by Torvik (49%). 3-1; the one loss was 85-77 to UConn at a neutral site. Beat Marquette 84-70 and William & Mary 123-79. Torvik ranks the offense 25th and defense 18th, gives it an 89% chance of making the field at about a 5 seed, and rates its full-season schedule 2nd toughest in the country. Faces Ohio State 1/30 and 3/7, Penn State 2/23." },
    { name: "Ohio State", conf: "Big Ten", wl: "4-2", trank: 32, oe: 119.8, de: 100.4, wab: -0.32, seed: 7.9, any: 68, auto: 3.9, proj: "19-13 (11-9)",
      next: [["Tue 11/24", "vs Vanderbilt", 54], ["Sun 11/29", "vs Lipscomb", 96], ["Wed 12/2", "at Nebraska", 24]],
      note: "4-2: lost to BYU 94-83 (neutral site) and at UConn 84-68, and its four wins are over teams ranked 200th or worse. No quality win yet; Torvik has it 0-2 against top competition. Offense is strong (119.8, 17th, shooting 61.8% on twos) but defense is average (100.4, 54th). Torvik gives it 68% to make the field at about a 7 seed. Vanderbilt on Tuesday is its first real resume chance, then Nebraska 12/2 and Kansas 12/19 (neutral)." }
  ];

  /* Games for the next stretch. p = [team, Torvik win chance]. */
  var GAMES = [
    { d: "2026-11-21", a: "Michigan", h: "Villanova", time: "7:00 PM ET · 5:00 PM MT", p: ["Villanova", 51] },
    { d: "2026-11-21", a: "Denver", h: "Eastern Michigan", p: ["Denver", 17] },
    { d: "2026-11-23", a: "Denver", h: "Kansas", p: ["Denver", 1] },
    { d: "2026-11-24", a: "Vanderbilt", h: "Ohio State", p: ["Ohio State", 54] },
    { d: "2026-11-24", a: "Coppin St.", h: "Villanova", p: ["Villanova", 99] },
    { d: "2026-11-24", a: "Michigan", h: "Creighton", neutral: true, p: ["Michigan", 67] },
    { d: "2026-11-25", a: "Penn State", h: "Memphis", neutral: true, p: ["Penn State", 47] },
    { d: "2026-11-27", a: "Villanova", h: "Kansas", p: ["Villanova", 15] },
    { d: "2026-11-28", a: "Denver", h: "New Mexico St.", p: ["Denver", 21] },
    { d: "2026-11-29", a: "Lipscomb", h: "Ohio State", p: ["Ohio State", 96] }
  ];

  /* Top 50 by T-Rank: rank, team, conf, W-L, AdjOE, AdjDE, Barthag, WAB, SOS, AP, BPI, tempo, note */
  var TOP = [
    [1,"Houston","Big 12","6-0",124.3,93.2,0.965,2.5,11.76,8,4,67.9,"Beat Florida this week (B/R). Best WAB in the country."],
    [2,"Illinois","Big Ten","5-1",125.8,96.5,0.9545,1,4.63,10,1,73.9,"Best AdjOE in the country. Beat Duke by 21 after losing 84-78 at Texas Tech."],
    [3,"Duke","ACC","3-2",120.2,92.4,0.9536,-0.44,5.84,5,2,71.6,"Best AdjDE in the country. Losses to Michigan State (79-73) and Illinois."],
    [4,"Florida","SEC","6-1",124.6,95.9,0.953,2.3,12.9,1,3,68.8,"AP No. 1. Lost to Houston this week (B/R)."],
    [5,"Kansas","Big 12","5-1",122.1,94.0,0.9529,1.3,10.5,11,8,73.2,"Beat Kentucky by 20 without Melvin Council Jr. (foot) (B/R)."],
    [6,"Arizona","Big 12","4-1",121.3,94.5,0.946,1.1,13.19,12,10,72.1,"Won at Auburn (B/R). Toughest schedule of the 50 so far (SOS +13.19)."],
    [7,"Virginia","ACC","7-0",123.5,96.5,0.9445,1.5,-1.15,4,22,70.4,"Beat Arkansas and won at Maryland (B/R). Plays UConn at Madison Square Garden before Christmas."],
    [8,"Michigan State","Big Ten","4-1",120.2,94.1,0.9432,0.8,4.17,2,9,68.8,"Beat Duke 79-73. Jeremy Fears Jr. is B/R's player of the year frontrunner."],
    [9,"UConn","Big East","4-1",119.6,94.3,0.9387,1.0,8.11,3,5,67.3,"Beat Ohio State (B/R). Plays Virginia at Madison Square Garden in December."],
    [10,"Texas Tech","Big 12","5-0",120.3,95.2,0.9371,0.9,-2.75,9,7,68.6,"Beat Illinois 84-78. J.T. Toppin is out with a torn ACL (B/R)."],
    [11,"Gonzaga","Pac-12","3-1",123.1,98.0,0.9321,0.29,10.07,22,20,70.4,"Lost at home to LSU after leading by 13 with eight minutes left (B/R)."],
    [12,"Nebraska","Big Ten","5-0",118.6,94.5,0.9316,0.9,-2.01,24,11,69.4,"Beat Boise State by double digits (B/R)."],
    [13,"St. John's","Big East","5-0",119.2,95.3,0.9291,0.5,-0.99,13,18,72.4,"Beat Syracuse (B/R)."],
    [14,"Vanderbilt","SEC","6-0",118.7,95.6,0.9233,0.8,-0.11,15,15,69.7,"Beat Memphis handily (B/R)."],
    [15,"Iowa State","Big 12","3-1",115.1,92.9,0.9213,-0.6,-6.6,null,13,69.2,"Second-best AdjDE but only 64th in AdjOE. Lost to Memphis (B/R)."],
    [16,"Miami (FL)","ACC","5-1",119.1,96.2,0.9207,-0.11,-9.92,17,12,72.2,"Lightest schedule of the top 25 so far (SOS -9.92)."],
    [17,"Michigan","Big Ten","3-1",119.1,96.6,0.9173,0.35,9.23,18,28,73.2,"Reigning national champion. Beat Marquette by 14 (B/R)."],
    [18,"Tennessee","SEC","5-0",116.8,95.2,0.9125,0.8,-4.52,14,16,68.2,"Best eFG% defense in the country (31.7%)."],
    [19,"UCLA","Big Ten","5-0",120.3,98.2,0.9123,0.9,-6.75,7,14,68.7,""],
    [20,"Alabama","SEC","5-0",121.8,99.5,0.9103,0.7,3.45,16,25,75.8,"Fifth-fastest tempo in the country (75.8)."],
    [21,"Louisville","ACC","3-1",119.6,97.9,0.9097,-0.38,-2.92,23,33,70.6,"Blew a 23-6 lead and lost by 20 at Memphis (B/R)."],
    [22,"Texas","SEC","5-0",120.5,98.6,0.9092,0.7,-8.33,6,6,69.6,"Beat Baylor in San Antonio (B/R)."],
    [23,"BYU","Big 12","5-0",121.5,99.5,0.9092,0.9,-4.37,21,19,71.4,"Best eFG% offense in the country (64.8%)."],
    [24,"USC","Big Ten","5-0",117.6,96.8,0.9042,1.0,-5.55,18,17,71.2,""],
    [25,"Missouri","SEC","5-1",119.5,98.6,0.9014,0.17,-2.42,null,23,69.6,"Beat Marquette 52-41 on a late 28-12 run (B/R)."],
    [26,"Texas A&M","SEC","6-0",118.7,98.5,0.8949,1.1,0.05,null,26,74.5,""],
    [27,"Purdue","Big Ten","4-2",118.9,98.8,0.8937,-0.8,3.07,null,41,65.5,"Plays slowly (65.5, 354th in tempo)."],
    [28,"Indiana","Big Ten","6-0",120.9,100.6,0.8919,1.5,2.02,null,36,69.1,""],
    [29,"Cincinnati","Big 12","4-1",116.1,96.7,0.8907,0.0,2.81,null,24,70.0,"Blew out Dayton (B/R)."],
    [30,"Marquette","Big East","3-2",115.1,96.0,0.8903,-0.46,1.64,null,29,69.8,"Lost at Michigan and to Missouri. Nigel James Jr. missed all 11 shots vs Michigan (B/R)."],
    [31,"Virginia Tech","ACC","6-0",119.6,100.0,0.8871,1.1,1.11,null,50,69.9,"Beat Iowa in overtime (B/R)."],
    [32,"Ohio State","Big Ten","4-2",119.8,100.4,0.8841,-0.32,4.27,null,37,68.9,"Lost to UConn (B/R)."],
    [33,"NC State","ACC","5-1",121.8,102.2,0.8832,0.13,1.31,null,35,69.2,"Seventh-best AdjOE (121.8) but 82nd in AdjDE."],
    [34,"Baylor","Big 12","4-1",119.1,100.0,0.8826,-0.19,-9.24,null,21,70.5,"Lost to Texas in San Antonio (B/R)."],
    [35,"Arkansas","SEC","4-2",117.6,98.9,0.8807,-0.46,-5.86,20,38,69.1,"Lost to Virginia (B/R). AP No. 20."],
    [36,"LSU","SEC","5-0",116.8,98.3,0.8793,1.0,-4.43,25,">50",71.0,"Won at Gonzaga. RJ Luis Jr. made his LSU debut (B/R)."],
    [37,"West Virginia","Big 12","4-2",116.5,98.7,0.8703,0.24,6.21,null,34,67.2,""],
    [38,"Iowa","Big Ten","3-2",118.5,100.5,0.87,-0.14,7.41,null,31,64.2,"Lost in overtime to Virginia Tech and by 1 to Creighton (B/R). Slowest tempo of the 50 (64.2)."],
    [39,"Georgia","SEC","6-0",119.4,101.6,0.8644,1.2,-1.61,null,47,71.2,"Won at North Carolina (B/R)."],
    [40,"Utah State","Pac-12","5-0",119.4,101.7,0.8642,0.23,-9.89,null,45,70.5,"Scored 118 vs Utah Tech and 120 vs UC San Diego (B/R)."],
    [41,"Villanova","Big East","3-2",117.0,99.8,0.8625,-0.9,-2.58,null,">50",69.4,""],
    [42,"Ole Miss","SEC","4-0",114.9,97.9,0.8618,0.16,-12.4,null,27,69.7,"Softest schedule of the 50 so far (SOS -12.40)."],
    [43,"Auburn","SEC","3-3",117.1,100.1,0.8582,-1.0,9.97,null,32,69.1,"Lost to Arizona at home (B/R). Tough schedule so far (SOS +9.97)."],
    [44,"Grand Canyon","Mountain West","4-0",115.6,98.9,0.8572,0.2,-5.83,null,39,72.0,"Highest-rated Mountain West team."],
    [45,"Xavier","Big East","5-1",114.7,98.5,0.8523,0.08,-4.24,null,42,73.3,"Beat Mississippi State in West Virginia (B/R)."],
    [46,"Maryland","Big Ten","3-2",118.1,101.5,0.851,-0.7,-3.26,null,">50",69.3,"Lost to Virginia at home (B/R)."],
    [47,"Oregon","Big Ten","3-1",119.1,102.6,0.8472,-0.48,-5.97,null,">50",69.1,""],
    [48,"Creighton","Big East","4-1",116.1,100.1,0.8462,0.22,1.87,null,44,70.4,"Beat Iowa by 1; lost at Kansas State (B/R)."],
    [49,"San Diego State","Pac-12","5-0",115.4,99.5,0.8461,0.6,-2.39,null,">50",69.4,""],
    [50,"North Carolina","ACC","4-1",114.4,98.7,0.8459,-0.24,2.87,null,48,72.0,"Lost at home to Georgia, shooting 9-for-38 from three (B/R)."]
  ];

  return {
    asOf: "Nov 21, 2026",
    FOLLOW: FOLLOW,
    TEAMS: TEAMS,
    GAMES: GAMES,
    TOP: TOP
  };
})();
