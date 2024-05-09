const spawn = require('child_process').spawn;
const path = require('path')

spawn('dotnet', ['restore', 'EdgePsCoreClr.sln'], { stdio: 'inherit', cwd: path.resolve(__dirname) })
    .on('close', function() {
        spawn('dotnet', ['build', 'EdgePsCoreClr.sln', '--configuration', 'Release'], { stdio: 'inherit', cwd: path.resolve(__dirname) })
    });

 spawn('msbuild', ['src/edge-ps/edge-ps.csproj', '/p:Configuration=Release'], { stdio: 'inherit', cwd: path.resolve(__dirname) })

   