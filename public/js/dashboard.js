document.addEventListener('DOMContentLoaded', async () => {

    const noDataLable = document.querySelector('.table_section .message');
    const noDataPieChart = document.querySelector('.wrapper .pieChart_noData_wrapper');
    const noDataDoughnutChart = document.querySelector('.wrapper .doughnutChart_noData_wrapper');
    const piechartElement = document.getElementById('pieChart');
    const doughnutChartElement =  document.getElementById('doughnutChart');

    // Line Chart
    const ctxLine = document.getElementById('lineChart').getContext('2d');
    const lineChart = new Chart(ctxLine, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Invoises',
                data: [],
                backgroundColor: 'rgba(75, 192, 192, 0)',
                borderColor: 'rgba(85, 166, 21, 1)',
                borderWidth: 3,
                fill: false
            }]
        },
        options: {
            maintainAspectRatio: false,
            scales: {
                x: {
                    beginAtZero: true,
                    grid: {
                        display: false // Remove x-axis grid lines
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        display: false // Remove y-axis grid lines
                    }
                },
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
    
    // Doughnut Chart
    const ctxDoughnut = document.getElementById('doughnutChart').getContext('2d');
    
    const doughnutChart = new Chart(ctxDoughnut, {
        type: 'doughnut',
        data: {
            labels: ['Paid', 'Unpaid'],
            datasets: [{
                label: 'Percentage',
                // data: [64,36],
                data: [],
                backgroundColor: [
                    'rgba(85, 166, 21, 1)',
                    'rgba(217, 217, 217, 1)'
                ],
                borderColor: [
                    'rgba(85, 166, 21, 1)',
                    'rgba(217, 217, 217, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            maintainAspectRatio: false,
            cutout: '70%',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                doughnutlabel: {
                    legend: [
                        {
                            text: 'Bold Text',
                            font: {
                                size: 20,
                                weight: 'bold',
                                color: 'black'
                            }
                        },
                        {
                            text: 'Non-Bold Text',
                            font: {
                                size: 16,
                                weight: 'normal'
                            }
                        }
                    ]
                }
            }
        }
    });


    // Pie Chart
    const ctxPie = document.getElementById('pieChart').getContext('2d');
    const pieChart = new Chart(ctxPie, {
        type: 'pie',
        data: {
            // labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            labels: [],
            datasets: [{
                label: 'Count',
                data: [],
                backgroundColor: [
                    // 'rgba(225, 183, 144, 1)',
                    // 'rgba(177, 157, 157, 1)',
                    // 'rgba(250, 122, 122, 1)',
                    // 'rgba(239, 153, 23, 1)',
                    // 'rgba(225, 245, 200, 1)',
                    // 'rgba(202, 109, 0, 1)',
                    // 'rgba(221, 223, 112, 1)'
                ],
                borderColor: [
                    // 'rgba(225, 183, 144, 1)',
                    // 'rgba(177, 157, 157, 1)',
                    // 'rgba(250, 122, 122, 1)',
                    // 'rgba(239, 153, 23, 1)',
                    // 'rgba(225, 245, 200, 1)',
                    // 'rgba(202, 109, 0, 1)',
                    // 'rgba(221, 223, 112, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            maintainAspectRatio: false,
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend:{
                    display: true,
                    position: 'right',
                    align: 'center', // Aligns legend to the start of the right side
                    labels: {
                        boxWidth: 20,
                        boxHeight: 20,
                        padding: 10,
                        color: 'blue',
                        font: {
                            size: 14,
                            weight: 'bold'
                        },
                        color: 'black'
                    }
                }
                
            }
        }
    });


    async function updataCharts() {
        // Example using fetch API to send a POST request with JSON data
        fetch('/dashboard/allData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {

            updataAllCharts(data)
        })
        .catch(error => {
            console.log('There was a problem with the fetch operation:', error);
        });
    }

    function updataAllCharts(data){

        const paidAndUnpaidInvoices = data.paidAndUnpaidInvoices;
        updateDoughnutChart(paidAndUnpaidInvoices)

        const invoicesGroupedByTagQuery = data.invoicesGroupedByTag;
        updatePieChart(invoicesGroupedByTagQuery)

        const invoicesReceivedQuery = data.invoicesReceived;
        updateLineChart(invoicesReceivedQuery)

        const dataForBoxes = [{
            'balance': data.budget,
            'spentMoney': data.spentMoney,
            'unpaidInvoices': data.unpaidInvoices,
            'date': `${data.startDate} - ${data.endDate}`,
        }];

        updateBoxes(dataForBoxes);

        updateTable(data.invoices);

    }

    function updateDoughnutChart(data){
        const doughnutChartTitle = document.querySelector('.doughnutChart_center .title');
        const doughnutChartDescription = document.querySelector('.doughnutChart_center .description');
        const chartDataElement = document.querySelector('.doughnutChart_center');
        

        doughnutChartElement

        
        if(data[0]){
            doughnutChartElement.style.display = 'block';
            chartDataElement.style.display = 'flex';
            noDataDoughnutChart.style.display = 'none';
        }else{
            doughnutChartElement.style.display = 'none';
            chartDataElement.style.display = 'none';
            noDataDoughnutChart.style.display = 'flex';
        }


        let paidPercent = 0;

        // New data to update the chart with
        if(data && data[0]){

            if(data[0].is_paid === true){
                paidPercent = data[0].proportion*100
            }else{
                paidPercent = (1-data[0].proportion)*100
            }

            const newData = [paidPercent, (100-paidPercent)];
            doughnutChart.data.datasets[0].data = newData;
            doughnutChart.update();
            doughnutChartTitle.innerHTML = 'Paid';
            doughnutChartDescription.innerHTML = `${Math.round(paidPercent)}%`;
        }else{
            doughnutChartTitle.innerHTML = 'No DATA';
            doughnutChartDescription.innerHTML = ``;
        }
    }

    function updatePieChart(data){

        if(data[0]){
            piechartElement.style.display = 'block';
            noDataPieChart.style.display = 'none';
        }else{
            piechartElement.style.display = 'none';
            noDataPieChart.style.display = 'flex';
        }

        let newData = [];
        data.forEach(tag => {
            newData.push(tag.count)
        });

        let newColors = [];
        data.forEach(tag => {
            if(tag.color){
                newColors.push(tag.color)
            }else{
                newColors.push('rgba(220,220,220,1)')
            }
        });

        let newNames = [];
        data.forEach(tag => {
            newNames.push(tag.name)
        });

        pieChart.data.labels = newNames;
        pieChart.data.datasets[0].data = newData;
        pieChart.data.datasets[0].backgroundColor = newColors;
        pieChart.data.datasets[0].borderColor = newColors;
        pieChart.update();
    }

    function updateLineChart(data){

        let newData = [];
        data.forEach(tag => {
            newData.push(tag.invoice_count)
        });

        let newLabels = [];
        data.forEach(tag => {
            newLabels.push(tag.invoice_day)
        });

        lineChart.data.labels = newLabels;
        lineChart.data.datasets[0].data = newData;
        lineChart.update();
    }

    function updateBoxes(data){
        const balanceBox = document.querySelector('.info_box:nth-child(1) .description');
        const unpaidinvoicesBox = document.querySelector('.info_box:nth-child(2) .description');
        const spentBox = document.querySelector('.info_box:nth-child(3) .description');
        const dateBox = document.querySelector('.title > span');
        
        balanceBox.innerHTML = `${data[0].balance} EUR`;
        unpaidinvoicesBox.innerHTML = `${data[0].unpaidInvoices}`;
        spentBox.innerHTML = `${data[0].spentMoney} EUR`;
        dateBox.innerHTML = `${data[0].date}`;
    }

    function updateTable(data){
        
        if(data[0]){
            noDataLable.style.display = 'none';
        }else{
            noDataLable.style.display = 'flex';
        }

        const tableContainer = document.querySelector('tbody');

        let elements = '';
        for(i=0; i < data.length; i++){
            elements += `
            <tr>
                <td>${i+1}</td>
                <td>${data[i].supplier_name}</td>
                <td>${data[i].due_date}</td>
                <td>${data[i].total_amount}</td>
                <td>
                    <span class="unpaid">unpaid</span>
                </td>
                <td>
                    <button id="paidBtn${data[i].id}">Paid</button>
                    <button href="/invoice">Mannage</button>
                </td>
            </tr>
            `

        }

        tableContainer.innerHTML = elements;
        statusButtonAddEvent(data)
    }
    
    updataCharts()



    
    // Status Button controller
    function statusButtonAddEvent(invoices){
        invoices.forEach(row => {
            console.log(row)
            const button = document.getElementById(`paidBtn${row.id}`);

            const bodyData = {
                invoiceID: row.id
            };

            // Add event listener to the button
            button.addEventListener('click', async function() {
                await fetch('/dashboard/setPaid', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(bodyData)

                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok ' + response.statusText);
                    }
                    return response.json();
                })
                .then(data => {
                    updataCharts()
                })
                .catch(error => {
                    console.log('There was a problem with the fetch operation:', error);
                });
            });
        });
    }

});