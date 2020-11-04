const company = [{
    id: 0,
    parent_id: null,
    name: 'ABC',
}, {
    id: 1,
    parent_id: 0,
    name: 'IT dept'
}, {
    id: 2,
    parent_id: 0,
    name: 'QA dept'
}, {
    id: 3,
    parent_id: 1,
    name: 'IT Head'
}, {
    id: 4,
    parent_id: 3,
    name: 'Tech Lead'
}, {
    id: 5,
    parent_id: 4,
    name: 'Software Engineer'
}, {
    id: 6,
    parent_id: 2,
    name: 'QA Head'
}, {
    id: 7,
    parent_id: 6,
    name: 'QA Lead'
}, {
    id: 8,
    parent_id: 7,
    name: 'QA Engineer'
}, {
    id: 9,
    parent_id: 7,
    name: 'Trainee'
}];

const employees = [{
    id: 1, dept_id: 3, name: 'Hyman Tancock', phone: '458-522-6693', salary: 5587
}, {
    id: 2, dept_id: 4, name: 'Jeno De Castri', phone: '375-352-8392', salary: 3971
}, {
    id: 3, dept_id: 4, name: 'Tristan Brunone', phone: '543-312-2467', salary: 3208
}, {
    id: 4, dept_id: 4, name: 'Kevon MacBain', phone: '771-564-9187', salary: 2012
}, {
    id: 5, dept_id: 5, name: 'Tabitha Dumberell', phone: '393-966-0834', salary: 2085
}, {
    id: 6, dept_id: 5, name: 'Shanda Pennoni', phone: '380-563-6362', salary: 1925
}, {
    id: 7, dept_id: 5, name: 'Parsifal Fillary', phone: '438-292-3094', salary: 2647
}, {
    id: 8, dept_id: 5, name: 'Blondy Maccari', phone: '265-218-5506', salary: 2536
}, {
    id: 9, dept_id: 6, name: 'Teddie Bouzan', phone: '206-237-9078', salary: 3458
}, {
    id: 10, dept_id: 6, name: 'Koral Tideswell', phone: '876-102-1478', salary: 3270
}, {
    id: 11, dept_id: 7, name: 'Robby Karim', phone: '310-452-5507', salary: 4406
}, {
    id: 12, dept_id: 7, name: 'Mandy Goeff', phone: '760-925-3479', salary: 4266
}, {
    id: 13, dept_id: 8, name: 'Casper Alvarado', phone: '479-268-1091', salary: 2784
}, {
    id: 14, dept_id: 8, name: 'Phillipe Ballston', phone: '871-925-4342', salary: 2248
}, {
    id: 15, dept_id: 8, name: 'Adiana Chadwin', phone: '541-144-7711', salary: 2803
}, {
    id: 16, dept_id: 8, name: 'Maison Burdhill', phone: '477-349-4406', salary: 1356
}, {
    id: 17, dept_id: 9, name: 'Rosy Carden', phone: '561-733-5707', salary: 1189
}, {
    id: 18, dept_id: 9, name: 'Lorie Shaddick', phone: '244-241-7983', salary: 1664
}, {
    id: 19, dept_id: 9, name: 'Leo Goldsmith', phone: '953-576-4337', salary: 1090
}, {
    id: 20, dept_id: 9, name: 'Ken Balshen', phone: '611-887-7568', salary: 1169
}]

let selectedEmployeeTreeItem = null;

const deptIds = [];
employees.forEach(employee => {
    if (!deptIds.includes(employee.dept_id)) {
        deptIds.push(employee.dept_id);
    }
});

function makeTree(originalArr) {
    const arr = stringClone(originalArr);

    for (let i = 0; i < arr.length; i++) {
        const potentialParent = arr[i];

        for (let j = 0; j < arr.length; j++) {
            const potentialChild = arr[j];

            if (potentialParent.id === potentialChild.parent_id) {
                if (!potentialParent.children) potentialParent.children = [];
                potentialParent.children.push(potentialChild);
            }
        }
    }

    return arr.filter(item => item.parent_id === null);
}

function createDOMTree(collection, containerEl) {
    const rootEl = document.createElement('ul');
    buildTree(collection, rootEl);

    containerEl.appendChild(rootEl);
}

function getBulletEl() {
    const iEl = document.createElement('i');
    iEl.classList.add('collapsed');

    return iEl;
}

function buildTree(arr, rootEl) {
    for (let i = 0; i < arr.length; i++) {
        const branchEl = arr[i];

        const liEl = document.createElement('li');
        const spanEl = document.createElement('span');

        if (branchEl.children) liEl.appendChild(getBulletEl());

        spanEl.innerText = branchEl.name;
        spanEl.dataset.deptId = branchEl.id;

        if (!deptIds.includes(branchEl.id)) {
            spanEl.classList.add('disabled-tree-item');
        }

        liEl.appendChild(spanEl);

        rootEl.appendChild(liEl);

        if (branchEl.children) {
            ulEl = document.createElement('ul');
            liEl.appendChild(ulEl);
            buildTree(branchEl.children, ulEl);
        }
    }
}

const jsTree = makeTree(company);
const containerEl = document.getElementById('branch-container');
createDOMTree(jsTree, containerEl);

const selectorBtn = document.querySelector('#currency-choice');

containerEl.addEventListener('click', event => {
    selectorBtn.value = 'BYN';

    if (event.target.tagName === 'SPAN') {
        const filteredEmployees = getEmployeesByDeptId(employees, +event.target.dataset.deptId);

        displayEmployeesData(filteredEmployees);

        selectedTreeItem(event.target);

        return;
    }

    if (event.target.tagName === "I") {
        const elToHide = event.target.parentElement.getElementsByTagName('ul')[0];
        elToHide.classList.toggle('hidden');
    }
})

function stringClone(collection) {
    return JSON.parse(JSON.stringify(collection));
}

function getEmployeesByDeptId(employeesCollection, id) {
    return employeesCollection.filter(employee => employee.dept_id === id);
}

function displayEmployeesData(employees) {
    clearTable();
    const fields = ['id', 'name', 'phone', 'salary'];
    const tBody = getTableBody();

    employees.forEach(employee => {
        const tRow = document.createElement('tr');

        for (let i = 0; i < fields.length; i++) {
            const tD = document.createElement('td');
            const fieldName = fields[i];
            tD.innerText = employee[fieldName];


            if (fieldName === 'salary') {
                tD.dataset.salary = 'salary';
                tD.dataset.originalValue = employee[fieldName];
            }

            tRow.appendChild(tD);
        }

        tBody.appendChild(tRow);
    })
}

function getTableBody() {
    const tBodyEl = document.getElementsByTagName('tbody')[0];

    if (tBodyEl) return tBodyEl;

    const table = document.getElementsByTagName('table')[0];
    const newTbodyEl = document.createElement('tbody');

    table.appendChild(newTbodyEl);

    return newTbodyEl;
}

function clearTable() {
    const tBody = document.getElementsByTagName('tbody')[0];
    const table = document.getElementsByTagName('table')[0];

    if (tBody) {
        table.removeChild(tBody);
    }
}

function selectedTreeItem(selectedItem) {
    clearTreeSelection();

    selectedEmployeeTreeItem = selectedItem;
    selectedItem.classList.add('selected-tree-item');
}

function clearAll() {
    clearTable();
    clearTreeSelection();
}

function clearTreeSelection() {
    if (selectedEmployeeTreeItem)
        selectedEmployeeTreeItem.classList.remove('selected-tree-item');
}

async function getData(curID) {
    try {
        const response = await fetch(`https://www.nbrb.by/api/exrates/rates/${curID}`);
        return response.json();
    }
    catch (e) {
        console.log(e);
    }
}

function convertData(res, employee) {
    const tDsWithSalary = document.querySelectorAll('td[data-salary]');
    const salaryArr = Array.from(tDsWithSalary);

    const scale = res.Cur_Scale;
    const rate = res.Cur_OfficialRate;

    // const convertedSalaries = [];

    /* salaryArr.forEach(employee => {
        convertedSalaries.push(((+employee.dataset.originalValue * scale) / rate).toFixed(2));
    })

    return convertedSalaries;*/

    return ((+employee.dataset.originalValue * scale) / rate).toFixed(2);
}

selectorBtn.addEventListener('change', async event => {
    let currencyID;
    const tDsWithSalary = document.querySelectorAll('td[data-salary]');
    const salaryArr = Array.from(tDsWithSalary);

    switch (selectorBtn.value) {
        case 'BYN':
            salaryArr.forEach(tD => tD.innerText = tD.dataset.originalValue);
            return;
        case 'USD':
            currencyID = 145;
            break;
        case 'EUR':
            currencyID = 292;
            break;
        default: break;
    }

    const res = await getData(currencyID);

    salaryArr.forEach(employee => employee.innerText = convertData(res, employee));

    /* const convertedValues = convertData(res);
    
    for (let i = 0; i < salaryArr.length; i++) {
        for (let j = 0; j < convertedValues.length; j++) {
            if (i === j) salaryArr[i].innerText = convertedValues[j];
        }
    } */
})