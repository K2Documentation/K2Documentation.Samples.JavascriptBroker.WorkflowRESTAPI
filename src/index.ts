import '@k2oss/k2-broker-core';

metadata = {
    "systemName": "WorkflowRESTTest",
    "displayName": "Workflow REST API Test",
    "description": "Broker to call workflow REST API on local box",
    "configuration": {
        "ServiceURL": {
            displayName: "Workflow REST API URL",
            type: "string",
            value: "https://talley1.onk2stable.com/Api/Workflow/V1/workflows/"
        }
    }
};

ondescribe = async function ({configuration}): Promise<void> {
    postSchema({
        objects: {
            "workflows": {
                displayName: "Workflows",
                description: "Manage Workflows",
                properties: {
                    "id": {
                        displayName: "ID",
                        type: "number"
                    },
                    "folio": {
                        displayName: "Folio",
                        type: "string"
                    }
                },
                methods: {
                    "start": {
                        displayName: "Start a workflow",
                        type: "create",
                        inputs: ["folio"],
                        requiredInputs: ["folio"],
                        outputs: ["id"]
                    }
            }
        }
        }})
};

onexecute = async function ({objectName, methodName, parameters, properties, configuration}): Promise<void> {
    switch (objectName) {
        case "workflows": await onexecuteWorkflows(methodName, parameters, properties, configuration); break;
        default: throw new Error("The object " + objectName + " is not supported.");
    }
}

async function onexecuteWorkflows(methodName: string, parameters: SingleRecord, properties: SingleRecord, configuration: SingleRecord): Promise<void> {
    switch (methodName) {
        case "start": await onexecuteStartWorkflow(parameters, properties, configuration); break;
        default: throw new Error("The method " + methodName + " is not supported.");
    }
}


function onexecuteStartWorkflow(parameters: SingleRecord, properties: SingleRecord, configuration: SingleRecord): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        var urlValue = configuration["ServiceURL"] + '7';
        var data = JSON.stringify({
            "folio": properties["folio"]
        });

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            try {
                if (xhr.readyState !== 4) return;
                // look for 'created' code
                if (xhr.status !== 201 && xhr.status !== 200) throw new Error("Failed with status " + xhr.responseText);

                var obj = JSON.parse(xhr.responseText);
                postResult({
                    "id": obj.id
                });
                resolve();
            } catch (e) {
                reject(e);
            }
        }

        //xhr.withCredentials = true;
        xhr.open("POST", urlValue);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Authorization", "Basic YWRtaW5AbTM2NXgyNTIzOTEub25taWNyb3NvZnQuY29tOjEzdTlHMDZNaFk=");
        xhr.send(data);
    });
}