exports["default"]=function(e){var i=String(e).split("."),t=i[0],n=i[1]||"",r=!i[1],s=t.slice(-2),c=n.slice(-2);return r&&1==s||1==c?"one":r&&2==s||2==c?"two":r&&(3==s||4==s)||3==c||4==c?"few":"other"}