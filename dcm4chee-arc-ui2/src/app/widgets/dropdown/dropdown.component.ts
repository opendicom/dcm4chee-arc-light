import {
    AfterContentInit, AfterViewChecked, ChangeDetectorRef,
    Component,
    ContentChild,
    ContentChildren,
    EventEmitter,
    Input,
    Output,
    QueryList
} from '@angular/core';
import {OptionService} from "./option.service";
import {SelectDropdown} from "../../interfaces";
import {OptionComponent} from "./option.component";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {SearchPipe} from "../../pipes/search.pipe";

@Component({
    selector: 'j4care-select',
    templateUrl: './dropdown.component.html',
    styleUrls: ['./dropdown.component.scss'],
    animations:[
        trigger("showHide",[
            state("show",style({
                padding:"*",
                height:'*',
                opacity:1
            })),
            state("hide",style({
                padding:"0",
                opacity:0,
                height:'0px',
                margin:"0"
            })),
            transition("show => hide",[
                animate('0.1s')
            ]),
            transition("hide => show",[
                animate('0.2s cubic-bezier(.52,-0.01,.15,1)')
            ])
        ])
    ]
})
export class DropdownComponent implements AfterContentInit, AfterViewChecked {
    selectedValue:string;
    selectedDropdown:SelectDropdown;
    @Input() placeholder:string;
    @Input() multiSelectMode:boolean = false;
    @Input() showSearchField:boolean = false;
    uniqueId;
    @Input() maxSelectedValueShown = 2;
    @Input('model')
    set model(value){
        if(!(this.selectedDropdown && this.selectedDropdown.value === value)){
            this.selectedValue = value;
            this.selectedDropdown  = this.getSelectDropdownFromValue(value);
            this.setSelectedElement();
        }
    }
    @ContentChild(OptionComponent) template: OptionComponent;
    @ContentChildren(OptionComponent) children:QueryList<OptionComponent>;

    @Output() modelChange =  new EventEmitter();
    showDropdown:boolean = false;
    multiSelectValue = [];
    search = '';
    searchPipe = new SearchPipe();
    constructor(
    ) {}

    toggleDropdown(){
        this.showDropdown = !this.showDropdown;
    }

    ngAfterContentInit(): void {
        this.children.forEach(result=>{
            setTimeout(()=>{
                result.multiSelectMode = this.multiSelectMode;
            },100);
            result.selectEvent.subscribe(e=>{
               if(this.multiSelectMode){
                   if(e.value === ""){
                       this.multiSelectValue = [];
                   }else{
                       if(this.multiSelectValue.indexOf(e.value) > -1){
                           this.multiSelectValue.splice(this.multiSelectValue.indexOf(e.value),1);
                       }else{
                           this.multiSelectValue.push(e.value);
                       }
                   }
                   this.modelChange.emit(this.multiSelectValue);
               }else{
                   this.modelChange.emit(e.value);
                   this.showDropdown = false;
               }
               console.log("multiSelectValue",this.multiSelectValue);
            })
        });
        if(this.selectedValue){
            this.selectedDropdown = this.getSelectDropdownFromValue(this.selectedValue);
        }
    }
    searchEvent(){
        this.children.forEach(childe=>{
            if(childe.value.toLowerCase().indexOf(this.search.toLowerCase()) > -1 || childe.htmlLabel.stringify().toLowerCase().indexOf(this.search.toLowerCase()) > -1){
                childe.showElement = true;
            }else{
                childe.showElement = false;
            }
        })
    }

    getSelectDropdownFromValue(value):SelectDropdown{
        let endDropdown:any =  new SelectDropdown(value,'');
        if(value && this.children){
            this.children.forEach(element=>{
                if(element.value === value){
                    endDropdown = element;
                }
            });
        }
        return endDropdown;
    }
    setSelectedElement(){
/*        console.log("insetselectedelement",this.children);
        console.log("selectedValue",this.selectedValue);*/
        if(this.multiSelectMode){
            if(this.children && this.selectedValue){
                this.children.forEach(element=>{
                    // console.log("uniqueId3",element.uniqueId);
                    if(this.multiSelectValue.indexOf(element.value) > -1){
                        element.selected = true;
                    }else{
                        element.selected = false;
                    }
                });
            }
        }else{
            if(this.children && this.selectedValue){
                this.children.forEach(element=>{
                    // console.log("uniqueId3",element.uniqueId);
                    if(element.value === this.selectedValue || element.value === this.selectedValue){
                        element.selected = true;
                    }else{
                        element.selected = false;
                    }
                });
            }
        }
    }

    ngAfterViewChecked(): void {
        setTimeout(()=>{
            this.setSelectedElement();
        },100);
    }
}
