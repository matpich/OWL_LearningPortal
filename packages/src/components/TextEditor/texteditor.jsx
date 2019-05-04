import React from 'react';
import { connect } from 'react-redux';
import { DraftailEditor, BLOCK_TYPE, INLINE_STYLE, ENTITY_TYPE } from "draftail";
import Icon from "react-icons-kit";
import {textColor} from 'react-icons-kit/icomoon/textColor'
import {bold} from 'react-icons-kit/icomoon/bold'
import {underline} from 'react-icons-kit/icomoon/underline'
import {italic} from 'react-icons-kit/icomoon/italic'
import {strikethrough} from 'react-icons-kit/icomoon/strikethrough'
import {superscript2 as superscript} from 'react-icons-kit/icomoon/superscript2'
import {subscript2 as subscript} from 'react-icons-kit/icomoon/subscript2'
import {embed2 as embed} from 'react-icons-kit/icomoon/embed2'
import {quotesRight} from 'react-icons-kit/icomoon/quotesRight'
import {list2 as list} from 'react-icons-kit/icomoon/list2'
import {listNumbered} from 'react-icons-kit/icomoon/listNumbered'
import {section} from 'react-icons-kit/icomoon/section'
import {quotesLeft} from 'react-icons-kit/icomoon/quotesLeft'
import {ic_keyboard_arrow_down as arrowDown} from 'react-icons-kit/md/ic_keyboard_arrow_down'

import ColorPickerIcon from "../ColorPickerIcon/colorpickericon"

import "draft-js/dist/Draft.css";
import "draftail/dist/draftail.css";
import "./texteditor.css";

class TextEditor extends React.Component
{
    state = { textColor: "#000000"}

    initial = JSON.parse(sessionStorage.getItem("draftail:content"))
    
    blockTypes = 
    [
        { type: BLOCK_TYPE.HEADER_ONE },
        { type: BLOCK_TYPE.HEADER_TWO },
        { type: BLOCK_TYPE.HEADER_THREE },
        { type: BLOCK_TYPE.HEADER_FOUR },
        { type: BLOCK_TYPE.HEADER_FIVE },
        { 
            type: BLOCK_TYPE.UNORDERED_LIST_ITEM,
            icon: <Icon icon={list} />,
            description: "Lista", 
        },
        { 
            type: BLOCK_TYPE.ORDERED_LIST_ITEM,
            icon: <Icon icon={listNumbered} />,
            description: "Lista numerowana", 
        },
        { 
            type: BLOCK_TYPE.BLOCKQUOTE,
            icon: <Icon icon={quotesLeft} />,
            description: "Blok cytatu", 
        },
        { type: BLOCK_TYPE.CODE },
        { 
            type: BLOCK_TYPE.UNSTYLED,
            icon: <Icon icon={section} />,
            description: "Paragraf", 
        },
    ]

    entityTypes=
    [
        { type: ENTITY_TYPE.LINK },
        { type: ENTITY_TYPE.IMAGE },
        { type: ENTITY_TYPE.HORIZONTAL_RULE },
    ] 

    onSave = (content) =>
    {
        sessionStorage.setItem("draftail:content", JSON.stringify(content))
    }

    createInlineStyles()
    {
        this.inlineStyles = 
        [
            { 
                type: INLINE_STYLE.BOLD,
                icon: <Icon icon={bold} />,
                description: "Pogrubienie",
            },
            { 
                type: INLINE_STYLE.ITALIC,
                icon: <Icon icon={italic} />,
                description: "Kursywa",
            },
            { 
                type: INLINE_STYLE.UNDERLINE,
                icon: <Icon icon={underline} />,
                description: "Podkreślenie",
            },
            { 
                type: INLINE_STYLE.STRIKETHROUGH,
                icon: <Icon icon={strikethrough}/>,
                description: "Przekreślenie",
            },
            {
                description: "Kolor tekstu",
                type: `color-${this.state.textColor}`,
                icon: (
                        <div>
                            <Icon icon={textColor} style={ {color: this.state.textColor}} />
                            <ColorPickerIcon 
                                icon={arrowDown}
                                onPickerChange={this.onColorTextPickerChange.bind(this)}
                                color={this.state.textColor}
                                colors={['#000000', '#333333', '#4D4D4D', '#666666', '#808080', '#999999', '#B3B3B3', '#CCCCCC', '#FFFFFF', '#9F0500', '#D33115', '#F44E3B', '#C45100', '#E27300', '#FE9200', '#FB9E00', '#FCC400', '#FCDC00', '#808900', '#B0BC00', '#DBDF00', '#194D33', '#68BC00', '#A4DD00', '#0C797D', '#16A5A5', '#68CCCA', '#0062B1', '#009CE0', '#73D8FF', '#653294', '#7B64FF', '#AEA1FF', '#AB149E', '#FA28FF',  '#FDA1FF']}
                                width="210px"
                            />
                        </div>),
                style: 
                {
                    color: this.state.textColor
                }
            },
            { 
                type: INLINE_STYLE.CODE,
                icon: <Icon icon={embed}/>,
                description: "Kod"
            },
            { 
                type: INLINE_STYLE.QUOTATION,
                icon: <Icon icon={quotesRight}/>,
                description: 'Cytat'
            },
            { 
                type: INLINE_STYLE.SUBSCRIPT,
                icon: <Icon icon={subscript}/>,
                description: "Indeks dolny"
            },
            { 
                type: INLINE_STYLE.SUPERSCRIPT,
                icon: <Icon icon={superscript}/>,
                description: "Indeks górny" 
            },
            { 
                type: INLINE_STYLE.KEYBOARD,
                description: "Skrót klawiszowy"
            },
            
        ]
    }

    onColorTextPickerChange(color, event)
    {
        this.setState({ textColor: color.hex });
    }
    render()
    {
        this.createInlineStyles();
        return(
            <div>
                <DraftailEditor
                    rawContentState={this.initial || null}
                    onSave={this.onSave}
                    blockTypes={this.blockTypes}
                    inlineStyles={this.inlineStyles}
                    // entityTypes={this.entityTypes}
                />
            </div>
        )
    }
    
};

export default connect()(TextEditor);