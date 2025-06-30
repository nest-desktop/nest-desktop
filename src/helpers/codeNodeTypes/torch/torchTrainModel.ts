// torchTrainModel.ts

import { IntegerInterface } from "baklavajs";

import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";
import { defineCodeNode } from "@/helpers/codeGraph/defineCodeNode";

export default defineCodeNode({
  type: "torch/trainModel",
  title: "train model",
  inputs: {
    model: () => new NodeInputInterface("model"),
    device: () => new NodeInputInterface("device"),
    optimizer: () => new NodeInputInterface("optimizer"),
    loss_fn: () => new NodeInputInterface("loss fn"),
    num_epochs: () => new IntegerInterface("number of epochs", 10),
    train_loader: () => new NodeInputInterface("train loader"),
    test_loader: () => new NodeInputInterface("test loader"),
  },
  codeTemplate() {
    if (!this.node) return "";

    const model = this.node.getConnectedOutputVariableByInterface("model");
    const optimizer = this.node.getConnectedOutputVariableByInterface("optimizer");
    const lossFn = this.node.getConnectedOutputVariableByInterface("loss_fn");
    if (!model || !optimizer || !lossFn) return "";

    const device = this.node.getConnectedOutputVariableByInterface("device");

    let code = [
      "train_losses = []",
      `for epoch in range(${this.node.inputs.num_epochs.value}):`,

      // Training
      "\tmodel.train()",

      "\trunning_loss = 0.0",
      "\tfor batch_x, batch_y in train_loader:",
    ];

    if (device) code.push(`\t\tbatch_x, batch_y = batch_x.to(${device}), batch_y.to(${device})`);

    code = code.concat([
      "\t\toptimizer.zero_grad()",
      `\t\toutputs, state = ${model}(batch_x, None)`,
      `\t\tloss = ${lossFn}(outputs, batch_y)`,
      "\t\tloss.backward()",
      "\t\toptimizer.step()",
      "\t\trunning_loss += loss.item()",
      "\ttrain_losses.append(running_loss / len(train_loader))",
    ]);

    return code.join("\n");
  },
});

/**
 *
model = NetworkModel(layers).to(device)
optimizer = optim.Adam(model.parameters(), lr=0.01)
loss_fn = nn.MSELoss()

num_epochs = 50

for epoch in range(num_epochs):

    # Training
    model.train()
    running_loss = 0.0

    for batch_x, batch_y in train_loader:
        batch_x, batch_y = batch_x.to(device), batch_y.to(device)
        optimizer.zero_grad()
        outputs, state = model(batch_x, None)

        loss = loss_fn(outputs, batch_y)
        loss.backward()
        optimizer.step()

        running_loss += loss.item()

    train_losses.append(running_loss / len(train_loader))

    # Evaluation
    model.eval()
    with torch.no_grad():
        for batch_x, batch_y in test_loader:
            batch_x, batch_y = batch_x.to(device), batch_y.to(device)
            outputs, _ = model(batch_x)
 *
 */
