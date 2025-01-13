import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { FileUploadHandlerEvent, FileUploadModule } from 'primeng/fileupload';
import { read, utils } from 'xlsx';

@Component({
  selector: 'read-excel',
  imports: [FileUploadModule],
  template: `
    <div class="card flex gap-2 justify-center">
      <p-fileupload
        [multiple]="false"
        [customUpload]="true"
        (uploadHandler)="onUpload($event)"
        accept=".xlsx,.odt,.ods"
        maxFileSize="10000000"
        mode="advanced"
      >
        <ng-template #empty>
          <div>Seleccione un archivo para cargar</div>
        </ng-template>
      </p-fileupload>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReadExcelComponent {
  onLoad = output<any[]>();
  onUpload(event: FileUploadHandlerEvent) {
    const file = event.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer;
      const wb = read(arrayBuffer, { type: 'array' });
      const sheetNames = wb.SheetNames;
      const data = sheetNames.map((name) =>
        utils.sheet_to_json(wb.Sheets[name])
      );
      this.onLoad.emit(data);
    };
    reader.readAsArrayBuffer(file);
  }
}
