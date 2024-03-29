
let count = 0;

// Arrays of diffferent colors
// const highlightColors = [
//   '#FFD700', // Gold
//   '#AFEEEE', // PaleTurquoise
//   '#7FFFD4', // Aquamarine
//   '#D8BFD8', // Thistle
//   '#FFA07A', // LightSalmon
//   '#20B2AA', // LightSeaGreen
//   '#87CEFA', // LightSkyBlue
//   '#F08080', // LightCoral
//   '#E6E6FA', // Lavender
//   '#FAFAD2', // LightGoldenrodYellow
//   '#90EE90', // LightGreen
//   '#FFB6C1', // LightPink
//   '#B0E0E6', // PowderBlue
//   '#FFA500', // Orange
//   '#FFDAB9'  // PeachPuff
// ];



const highlightColors = [
  '#FFCCCC', // Light Red
  '#FFE4E1', // Misty Rose
  '#FFCC99', // Light Orange
  '#FFFF99', // Light Yellow
  '#FFFFCC', // Lighter Yellow
  '#F0FFF0', // Honeydew
  '#CCFFCC', // Light Green
  '#CCFF99', // Light Lime
  '#99FF99', // Pale Green
  '#AFEEEE', // Pale Turquoise
  '#ADD8E6', // Light Blue
  '#B0E0E6', // Powder Blue
  '#CCCCFF', // Light Periwinkle
  '#E0FFFF', // Light Cyan
  '#F0FFFF', // Azure
  '#F5F5DC', // Beige
  '#FAEBD7', // Antique White
  '#F5F5F5', // White Smoke
  '#FFF0F5', // Lavender Blush
  '#FFE4B5', // Moccasin
  '#FFDAB9', // Peach Puff
  '#FFFACD', // Lemon Chiffon
  '#FFF5EE', // Seashell
  '#F0E68C', // Khaki
  '#E6E6FA', // Lavender
];



function hangeCPU()
{
    console.log("CPU changed")
}
function addRows() { 

    const table = document.getElementById('jobsTable');
    const row = table.insertRow();
    for (let j = 0; j < 6; j++) {
    const cell = row.insertCell();
    if (j === 0) {
        cell.innerText = count + 1; // Job number
        count++;
    } else if (j === 1 || j === 2) {
        const input = document.createElement('input');
        input.type = 'number';
        input.min = '0';
        input.value = '0';
        cell.appendChild(input);
    } else {
        cell.innerText = '0'; // Initialize other cells with '0'
    }
    }
  }

  function removeRows() {
    const table = document.getElementById('jobsTable');
    const lastRow = table.rows[table.rows.length - 1]; // Get the last row
    if (count > 0) {
      table.deleteRow(table.rows.length - 1); // Delete the last row
      count--; // Decrease the job count if there are more than one row
    }
  }
  
  // Add event listeners to the buttons
document.getElementById('FCFS').addEventListener('click', function () {
  this.style.backgroundColor = 'lightblue'; // Change FCFS button color
  document.getElementById('SJF').style.backgroundColor = 'white'; // Reset SJF button color
  calculateSchedule('FCFS');
});

document.getElementById('SJF').addEventListener('click', function () {
  this.style.backgroundColor = 'lightgreen'; // Change SJF button color
  document.getElementById('FCFS').style.backgroundColor = 'white'; // Reset FCFS button color
  calculateSchedule('SJF');
});
  // Common function to calculate the schedule based on the selected method
  function calculateSchedule(method) {
    if (method === 'FCFS') {
      calculateFCFS();
    } else if (method === 'SJF') {
      calculateSJF();
    }
  }
  
  // FCFS Calculation
  function calculateFCFS() {
      const table = document.getElementById('jobsTable');
      const noOfCPUs = parseInt(document.getElementById('noOfCPUs').value, 10);
      let cpus = new Array(noOfCPUs).fill(0); // Track end time for each CPU
      let jobs = [];
      let totalTurnaroundTime = 0;
      
      let jobsData = []
      for(let i=0; i < noOfCPUs; i++) {
        jobsData.push([]);
      }


      
      let jobQueue = [];
      let jobQueueAddedTime = new Set()


      // Extract jobs data from the table
      for (let i = 1; i < table.rows.length; i++) {
        const row = table.rows[i];
        const arrivalTime = parseInt(row.cells[1].childNodes[0].value, 10);
        const burstTime = parseInt(row.cells[2].childNodes[0].value, 10);
        jobs.push({ row, arrivalTime, burstTime, startTime: 0, endTime: 0, index:i, isDone: false });
    }

  
    let temp = 0;
    while(temp != count) {
          let cpuMinIndex = cpus.indexOf(Math.min(...cpus));

          let tempJob = [];
          for( let i = 0; i <  jobs.length; i++ ) {
              if(!jobs[i].isDone && jobs[i].arrivalTime <= cpus[cpuMinIndex]) {
                  tempJob.push({ row: jobs[i].row, arrivalTime: jobs[i].arrivalTime, burstTime: jobs[i].burstTime, startTime: jobs[i].startTime, endTime: jobs[i].endTime, index:jobs[i].index+1, isDone: jobs[i].isDone });
              }
          }

          if(tempJob.length > 0 ){
      
              // Sort jobs by burst time
              tempJob.sort((a, b) => a.arrivalTime - b.arrivalTime);
              // console.log("tempJob:");
              // console.log(tempJob);



              let job1 = tempJob[0];
              // console.log("job1");
              // console.log(job1);


              const cpuIndex = cpus.indexOf(Math.min(...cpus));
              const startTime = Math.max(cpus[cpuIndex], job1.arrivalTime);
              const endTime = startTime + job1.burstTime;
              const turnaroundTime = endTime - job1.arrivalTime;
      
              // Update table with calculated times
              jobs[job1.index-2].row.cells[3].innerText = startTime;
              jobs[job1.index-2].row.cells[4].innerText = endTime;
              jobs[job1.index-2].row.cells[5].innerText = turnaroundTime;
              
              jobs[job1.index-2].isDone = true;
              // Update CPU end time to the end time of the current job
              // console.log("jobs:")
              // console.log(jobs);
              cpus[cpuIndex] = endTime;
      
              // Accumulate total turnaround time
              totalTurnaroundTime += turnaroundTime;

            
              // const jobQueue = [
              //   {2: [1, 2]},
              //   {4: [3]},
              //   {12: [4,5]}
              // ];


              // console.log(jobQueueAddedTime)
              // console.log(startTime in jobQueueAddedTime)

              if(!(jobQueueAddedTime.has(startTime))) {
                let tempjobQueue = {};
                tempjobQueue[startTime] = [];

                for(let i=0; i< tempJob.length; i++) {
                  tempjobQueue[startTime].push(tempJob[i].index-1);
                }
                jobQueue.push(tempjobQueue);
              }
              jobQueueAddedTime.add(startTime);

              // console.log(jobQueueAddedTime.has(startTime));
              jobsData[cpuIndex].push({ jobNumber: job1.index-1, startTime: startTime, endTime: endTime })
              
              temp++;
          }
          else {
              const cpuIndex = cpus.indexOf(Math.min(...cpus));
              cpus[cpuIndex]++;
          }
    }
    
    drawGanttChart(jobsData, 'ganttChartCanvas', jobQueue);
  // Display total turnaround time
  document.getElementById('totalTurnaroundTime').innerText = totalTurnaroundTime/count;
}

  
  // SJF Calculation
  function calculateSJF() {
      const table = document.getElementById('jobsTable');
      const noOfCPUs = parseInt(document.getElementById('noOfCPUs').value, 10);
      let cpus = new Array(noOfCPUs).fill(0); // Track end time for each CPU
      let jobs = [];
      let totalTurnaroundTime = 0;


      let jobsData = []
      for(let i=0; i < noOfCPUs; i++) {
        jobsData.push([]);
      }
    
  

      
      let jobQueue = [];
      let jobQueueAddedTime = new Set()



      // Extract jobs data from the table
      for (let i = 1; i < table.rows.length; i++) {
          const row = table.rows[i];
          const arrivalTime = parseInt(row.cells[1].childNodes[0].value, 10);
          const burstTime = parseInt(row.cells[2].childNodes[0].value, 10);
          jobs.push({ row, arrivalTime, burstTime, startTime: 0, endTime: 0, index:i, isDone: false });
      }
  
      
      let temp = 0;
      while(temp != count) {
            let cpuMinIndex = cpus.indexOf(Math.min(...cpus));

            let tempJob = [];
            for( let i = 0; i <  jobs.length; i++ ) {
                if(!jobs[i].isDone && jobs[i].arrivalTime <= cpus[cpuMinIndex]) {
                    tempJob.push({ row: jobs[i].row, arrivalTime: jobs[i].arrivalTime, burstTime: jobs[i].burstTime, startTime: jobs[i].startTime, endTime: jobs[i].endTime, index:jobs[i].index+1, isDone: jobs[i].isDone });
                }
            }

            if(tempJob.length > 0 ){
        
                // Sort jobs by burst time
                tempJob.sort((a, b) => a.burstTime - b.burstTime);
                // console.log("tempJob:");
                // console.log(tempJob);



                let job1 = tempJob[0];
                // console.log("job1");
                // console.log(job1);


                const cpuIndex = cpus.indexOf(Math.min(...cpus));
                const startTime = Math.max(cpus[cpuIndex], job1.arrivalTime);
                const endTime = startTime + job1.burstTime;
                const turnaroundTime = endTime - job1.arrivalTime;
        
                // Update table with calculated times
                jobs[job1.index-2].row.cells[3].innerText = startTime;
                jobs[job1.index-2].row.cells[4].innerText = endTime;
                jobs[job1.index-2].row.cells[5].innerText = turnaroundTime;
                
                jobs[job1.index-2].isDone = true;
                // Update CPU end time to the end time of the current job
                // console.log("jobs:")
                // console.log(jobs);
                cpus[cpuIndex] = endTime;
        
                // Accumulate total turnaround time
                totalTurnaroundTime += turnaroundTime;

                
            
              // const jobQueue = [
              //   {2: [1, 2]},
              //   {4: [3]},
              //   {12: [4,5]}
              // ];


              // console.log(jobQueueAddedTime)
              // console.log(startTime in jobQueueAddedTime)

              if(!(jobQueueAddedTime.has(startTime))) {
                let tempjobQueue = {};
                tempjobQueue[startTime] = [];

                for(let i=0; i< tempJob.length; i++) {
                  tempjobQueue[startTime].push(tempJob[i].index-1);
                }
                jobQueue.push(tempjobQueue);
              }
              jobQueueAddedTime.add(startTime);


                jobsData[cpuIndex].push({ jobNumber: job1.index-1, startTime: startTime, endTime: endTime })
                temp++;
            }
            else {
                const cpuIndex = cpus.indexOf(Math.min(...cpus));
                cpus[cpuIndex]++;
            }
      }

      
      drawGanttChart(jobsData, 'ganttChartCanvas', jobQueue);
    // Display total turnaround time
    document.getElementById('totalTurnaroundTime').innerText = totalTurnaroundTime/count;
  }






function drawGanttChart(jobsData, canvasId, jobQueue) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    // Set canvas dimensions
    canvas.width = window.innerWidth - 20;
    canvas.height = 600;
    
    const margin = { top: 20, right: 20, bottom: 40, left: 40 };
    const chartWidth = canvas.width - margin.left - margin.right;
    const chartHeight = canvas.height - margin.top - margin.bottom -300;
    console.log(chartHeight/jobsData.length)
    const cpuHeight = Math.min(80, chartHeight / jobsData.length); // Height of each CPU row
    
    let maxTime = Math.max(...jobsData.flatMap(cpu => cpu.map(job => job.endTime)));

    if(maxTime != parseInt(maxTime/50)*50) {
      maxTime = (parseInt(maxTime/50)+1)*50;
    }

    const timeScale = chartWidth / maxTime; // Pixels per time unit
  
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    // Draw the x and y axes
    ctx.beginPath();
    ctx.moveTo(margin.left + 20, margin.top);
    ctx.lineTo(margin.left + 20, canvas.height - margin.bottom -300);
    ctx.lineTo(canvas.width - margin.right, canvas.height - margin.bottom -300);
    ctx.stroke();
  
    // console.log(ctx.font)
    // 10px sans-serif
    ctx.font = "12px sans-serif"

    
    // Draw the jobs on the canvas
    jobsData.forEach((cpuJobs, cpuIndex) => {
      cpuJobs.forEach(job => {
        const startX = margin.left + 20 + job.startTime * timeScale;
        const jobWidth = (job.endTime - job.startTime) * timeScale;
  
        // Draw the job rectangle
        // ctx.fillStyle = getRandomColor();
        console.log((job.jobNumber-1)%25);
        ctx.fillStyle = highlightColors[(job.jobNumber-1)%25];
        ctx.fillRect(startX, margin.top + cpuHeight * cpuIndex, jobWidth, cpuHeight - 5);
  
        // Add text (job name) on the rectangle
        ctx.fillStyle = 'black';
        ctx.fillText(`J${job.jobNumber}`, startX + 5, margin.top + cpuHeight * cpuIndex + cpuHeight / 2);
      });
    });
  
    // Draw labels on axes
    ctx.textAlign = 'center';

    // console.log(maxTime);

    // Math.round(maxTime / 10)
    if( maxTime > 0) {
        for (let i = 0; i <= maxTime; i += (Math.round(maxTime / 10)+0.00000001)) {
            const x = margin.left + 20 + i * timeScale;
            const y = canvas.height - margin.bottom + 15 -300;
            // ctx.fillText(i, x, y);
            ctx.fillText(parseInt(i), x, y);
            // console.log("check");
          }
    }


    if( maxTime > 10) {
      for (let i = 0; i <= maxTime; i += (Math.round(maxTime / 10))) {
          const x = margin.left + 20 + i * timeScale;
          const y = canvas.height - margin.bottom + 15 -300;
          // ctx.fillText(i, x, y);
          ctx.fillText(parseInt(i), x, y);
          // console.log("check");
        }
  }

      // console.log("jobQueue")
      console.log(jobQueue);

      for (let j=0; j < jobQueue.length; j++) {
        let item = jobQueue[j];
        // console.log(item);

        let i = Object.keys(item)[0];

        let iInInt = parseInt(Object.keys(item)[0]);
        // Add time in new line
        const x = margin.left +20 + i * timeScale;
        const y = canvas.height - margin.bottom + 45 -300;
        // ctx.fillText(i, x, y);
        ctx.fillText(iInInt, x, y);
        // console.log("check");


        for(let k=0; k < item[i].length; k++){
          const x = margin.left + 20 + i * timeScale;
          const y = canvas.height - margin.bottom -300 + 65 + 15*k;
          // ctx.fillText(i, x, y);
          ctx.fillText("J" + item[i][k], x, y);
          // console.log("check");
        }

      }
    

    
    // console.log(jobsData);
    // return;
  
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (let i = 0; i < jobsData.length; i++) {
      const x = margin.left - 10 + 20;
      const y = margin.top + cpuHeight * i + cpuHeight / 2;
      ctx.fillText(`CPU-${i + 1}`, x, y);
    }


    
  }
  




  function getRandomColor() {
    // Random color for the job rectangles
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    // return color;
    return "#61aacc";
  }
  
  // Example usage:
  // Assuming jobsData is an array of arrays, with each sub-array representing jobs scheduled on one CPU
  // Each job object has jobNumber, startTime, and endTime properties
  const jobsData = [
    // [{ jobNumber: 2, startTime: 0, endTime: 10 } ],
    // [{ jobNumber: 3, startTime: 0, endTime: 20 }],
    // [{ jobNumber: 1, startTime: 0, endTime: 30 }]
  ];

  const jobQueue = [
    // {0: [1, 2, 3]}
  ];
  
  // Call this function after the page has loaded, or after the jobs data is ready
  drawGanttChart(jobsData, 'ganttChartCanvas', jobQueue);
  
