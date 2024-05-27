document.addEventListener('DOMContentLoaded', () => {

    // Line Chart
    const ctxLine = document.getElementById('lineChart').getContext('2d');
    const lineChart = new Chart(ctxLine, {
        type: 'line',
        data: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June'],
            datasets: [{
                label: 'Line Dataset',
                data: [2,3,1,5,4,1],
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
                label: 'Doughnut Dataset',
                data: [64,36],
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
            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [{
                label: 'Pie Dataset',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    'rgba(225, 183, 144, 1)',
                    'rgba(177, 157, 157, 1)',
                    'rgba(250, 122, 122, 1)',
                    'rgba(239, 153, 23, 1)',
                    'rgba(225, 245, 200, 1)',
                    'rgba(202, 109, 0, 1)',
                    'rgba(221, 223, 112, 1)'
                ],
                borderColor: [
                    'rgba(225, 183, 144, 1)',
                    'rgba(177, 157, 157, 1)',
                    'rgba(250, 122, 122, 1)',
                    'rgba(239, 153, 23, 1)',
                    'rgba(225, 245, 200, 1)',
                    'rgba(202, 109, 0, 1)',
                    'rgba(221, 223, 112, 1)'
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
});