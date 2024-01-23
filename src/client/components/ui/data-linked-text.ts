import { Component, BaseComponent } from "@flamework/components";

import { DataLinked } from "client/hooks";
import { DataKey, DataValue } from "shared/data-models/generic";
import { commaFormat } from "shared/utilities/helpers";

interface Attributes {
  readonly DataKey: DataKey;
}

@Component({ tag: "DataLinkedText" })
export class DataLinkedText extends BaseComponent<Attributes, TextLabel> implements DataLinked {
  public onDataUpdate(key: DataKey, value: DataValue): void {
    if (key !== this.attributes.DataKey) return;

    switch (key) {
      case "notes":
        this.instance.Text = commaFormat(<number>value);
        break;
    }
  }
}
