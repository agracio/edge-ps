## edge-ps


### This library is based on https://github.com/dfinke/edge-ps all credit for original work goes to Doug Finke. 
------

### This is a PowerShell compiler for edge.js.

Install edge and edge-ps modules:

``` 
npm install edge-js
npm install edge-ps
```

server.js:

```javascript
var edge = require('edge-js');

var hello = edge.func('ps', function () {/*
    "PowerShell welcomes $inputFromJS on $(Get-Date)"
*/});

hello('Node.js', function (error, result) {
    if (error) throw error;
    console.log(result[0]);
});
```

Run and enjoy:

```
C:\testEdgeps>node server
PowerShell welcomes Node.js on 05/04/2013 09:38:40
```

### Tapping into PowerShell's ecosystem

Rather than embedding PowerShell directly, you can use PowerShell files, dot source them and even use *Import-Module*.

What you can do in native PowerShell works in Node.js.

## What you need

* [Node.js](http://nodejs.org) 16.x or later. For Node.Js version support see [Edge.js](https://github.com/agracio/edge-js)
* [Edge.js](https://github.com/agracio/edge-js)
* PowerShell

#### Supported .NET frameworks

* .NET 4.5
* .NET Core - dotnet 8 or later.  

## Node.js + Edge.js + edge-ps (PowerShell) + Excel 

```javascript
var edge = require('edge-js');

var excelPS = edge.func('ps', function () {/*
    
    $data = $inputFromJS | Invoke-Expression
    
    $xl = New-Object -ComObject Excel.Application    
    $wf = $xl.WorksheetFunction    

    New-Object PSObject -Property @{
        Median = $wf.Median($data)
        StDev  = $wf.StDev($data)
        Var    = $wf.Var($data)
    } | ConvertTo-Json

    $xlProcess = Get-Process excel
    $xlProcess.kill()   
*/});

// Invoke PowerShell, it start Excel, gets a WorksheetFunction and then calls
// Median, StDev and Var on the array of data passed in.
// Here we are passing an array of 1 to 100
excelPS('1..100', function(error, result){
    
    if(error) throw error;
    
    console.log(result[0]);
});
```

```
{
    "Median":  50.5,
    "StDev":  29.011491975882016,
    "Var":  841.66666666666663
}
```

## Access Excel from the web with Node.js and PowerShell

![ScreenShot](https://raw.github.com/dfinke/edge-ps/master/Excel+PowerShell.png)

Here from a Node.js web server app we can call PowerShell which fires up Excel. From PowerShell we access Excel Worksheet Functions and at the end, return a simple html table with the results.

```javascript
var ps=edge.func('ps', function(){/*

    param($data=1..100)
     
    $xl = New-Object -ComObject Excel.Application
    $xlProcess = Get-Process excel
    $wf = $xl.WorksheetFunction

    #$data = $data | Invoke-Expression
     
    $r = New-Object PSObject -Property @{
        Median = $wf.Median($data)
        StDev  = $wf.StDev($data)
        Var    = $wf.Var($data)
    } 
     
    $xlProcess.kill()

@"
    <h2>Calling Excel Worksheet Functions in PowerShell in a Node.js web server</h2>
    <table border='1'>
    <tr><td>Median</td><td>$($r.Median)</td></tr>
    <tr><td>StDev</td><td>$($r.StDev)</td></tr>
    <tr><td>Var</td><td>$($r.Var)</td></tr>
    </table>
"@

*/})

```


## PowerShell Driving D3 Graph

![ScreenShot](https://raw.github.com/dfinke/edge-ps/master/d3Graph.png)

```javascript
var ps=edge.func('ps', function(){/*

$dataset = Get-Process |
			Sort handles -desc |
            Select -first 10 name, company, handles |
			ConvertTo-Json -Compress

@"
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title>Top 10 Process with most handles</title>
        <script type="text/javascript" src="js/d3.v3.js"></script>

        <link rel="stylesheet" type="text/css" href="css/chart.css" />

        <h2>Top 10 Process with most handles</h2>
        <span>Host: </span><span><b>$(hostname)</span>
    </head>

    <body>
        
        <script type="text/javascript">

            var dataset = $dataset;
      
            d3.select("body")
                .append("div")
                .attr("class","chart")
                .selectAll("div.line")
                .data(dataset)
                .enter()
                .append("div")
                  .attr("class","line")
            
            d3.selectAll("div.line")
                .append("div")
                .attr("class","label")
                .text(function(data) { return data.Name })

            d3.selectAll("div.line")
                .append("div")
                .attr("class","bar")
                .style("width", function(d){ return d.Handles/10 + "px" })
                .text(function(d){ return d.Handles });

        </script>
    
    </body>

</html>
"@

*/})
```

See [Edge.js on GitHub](https://github.com/agracio/edge-js) for more information. 
