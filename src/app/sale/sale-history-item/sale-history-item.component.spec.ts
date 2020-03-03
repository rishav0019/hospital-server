import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { SaleHistoryItemComponent } from "./sale-history-item.component";

describe("SaleHistoryItemComponent", () => {
  let component: SaleHistoryItemComponent;
  let fixture: ComponentFixture<SaleHistoryItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SaleHistoryItemComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleHistoryItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
