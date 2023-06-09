"use strict";
/*
    ATTR: This class is a manual reconstruction/transpliation of the package hec.data.tx.QualityTx
    Transpiler: Charles Graham
    Original Author: HEC and/or RMA
    Little Endian i.e. 31....0
*/


export default class QualityTx {
    constructor() {
        this.name = this.constructor.name
        this.elementData = new Int32Array(32)
        this.size = 0;
        this.SCREENED_BIT = 1
        this.OKAY_BIT = 2
        this.MISSING_BIT = 3
        this.QUESTION_BIT = 4
        this.REJECT_BIT = 5
        this.RANGE_OF_VALUE_BIT0 = 6
        this.RANGE_OF_VALUE_BIT1 = 7
        this.VALUE_DIFFERS_BIT = 8
        this.HOW_REVISED_BIT0 = 9
        this.HOW_REVISED_BIT1 = 10
        this.HOW_REVISED_BIT2 = 11
        this.REPLACE_METHOD_BIT0 = 12
        this.REPLACE_METHOD_BIT1 = 13
        this.REPLACE_METHOD_BIT2 = 14
        this.REPLACE_METHOD_BIT3 = 15
        this.ABSOLUTEMAGNITUDE_BIT = 16
        this.CONSTANTVALUE_BIT = 17
        this.RATEOFCHANGE_BIT = 18
        this.RELATIVEMAGNITUDE_BIT = 19
        this.DURATIONMAGNITUDE_BIT = 20
        this.NEGATIVEINCREMENTAL_BIT = 21
        this.NOT_DEFINED_BIT0 = 22
        this.GAGELIST_BIT = 23
        this.NOT_DEFINED_BIT1 = 24
        this.USER_DEFINED_TEST_BIT = 25
        this.DISTRIBUTIONTEST_BIT = 26
        this.RESERVED_BIT0 = 27
        this.RESERVED_BIT1 = 28
        this.RESERVED_BIT2 = 29
        this.RESERVED_BIT3 = 30
        this.RESERVED_BIT4 = 31
        this.PROTECTED_BIT = 32
        this.MASK = [1, 2, 4, 8, 16, 32, 64, 128]
        this.PADDING = [
            "", "0", "00", "000", "0000", "00000", "000000", "0000000", "00000000", "000000000",
            "0000000000", "00000000000", "000000000000", "0000000000000", "00000000000000", "000000000000000", "0000000000000000", "00000000000000000", "000000000000000000", "0000000000000000000",
            "00000000000000000000", "000000000000000000000", "0000000000000000000000", "00000000000000000000000", "000000000000000000000000", "0000000000000000000000000", "00000000000000000000000000", "000000000000000000000000000", "0000000000000000000000000000", "00000000000000000000000000000",
            "000000000000000000000000000000", "0000000000000000000000000000000", "00000000000000000000000000000000"
        ]
    }

    clearBit(bytes, bitPosition) {
        const targetByte = Math.floor((32 - bitPosition) / 8);
        const base = bytes[targetByte];
        const targetBit = (bitPosition - 1) % 8;
        const result = base & this.MASK[targetBit];
        if (result !== 0)
            bytes[targetByte] = base ^ this.MASK[targetBit];
        return bytes;
    }

    clearBit_int(intQuality, bitPosition) {
        return intQuality & (1 << bitPosition - 1 ^ 0xFFFFFFFF);
    }

    setBit(elementIndex, bitPosition) {
        if (typeof elementIndex == "object") {
            const targetByte = (32 - bitPosition) / 8;
            const base = bytes[targetByte];
            const targetBit = (bitPosition - 1) % 8;
            const result = base | MASK[targetBit];
            bytes[targetByte] = result;
            return bytes;
        } else {
            if (elementIndex > this.size || elementIndex < 0)
                throw new RangeError("Index of: " + elementIndex + " Out of range[0 - " + this.size);
            let bytes = getElementAt(elementIndex);
            bytes = this.setBit(bytes, bitPosition);
            setElementAt(bytes, elementIndex);
        }
    }
    setBit_int(intQuality, bitPosition) {
        return intQuality | 1 << bitPosition - 1;
    }
    isBitSet_int(intQuality, bitPosition) {
        return ((intQuality & 1 << bitPosition - 1) != 0);
    }

    isBitClear_int(intQuality, bitPosition) {
        return ((intQuality & 1 << bitPosition - 1) == 0);
    }

    _getElementAt(elementIndex) {
        if (elementIndex > this.size || elementIndex < 0)
            throw new RangeError("Index of: " + elementIndex + " Out of range[0 - " + this.size);
        let byteIndex = elementIndex * 4;
        let bytes = new Uint8Array(4);
        for (let i = 0; i < 4; i++)
            bytes.push(this.elementData[byteIndex + i])
        return bytes;
    }
    _getIntegerAt(elementIndex) {
        let bytes = getElementAt(elementIndex);
        let i0 = bytes[0] & 0xFF;
        let i1 = bytes[1] & 0xFF;
        let i2 = bytes[2] & 0xFF;
        let i3 = bytes[3] & 0xFF;
        return i3 | i2 << 8 | i1 << 16 | i0 << 24;
    }
    _getInteger(bytes) {
        let i0 = bytes[0] & 0xFF;
        let i1 = bytes[1] & 0xFF;
        let i2 = bytes[2] & 0xFF;
        let i3 = bytes[3] & 0xFF;
        return i3 | i2 << 8 | i1 << 16 | i0 << 24;
    }
    _isQualityClear(bytes) {
        return (this._getInteger(bytes) == 0);
    }
    _isScreened(elementIndex) {
        return this._isBitSet(elementIndex, 1);
    }
    isScreened_int(qualityInt) {
        return this.isBitSet_int(qualityInt, 1)
    }
    _isNotScreened(elementIndex) {
        return this._isBitClear(elementIndex, 1);
    }
    _isBitClear(elementIndex, bitPosition) {
        return !this._isBitSet(elementIndex, bitPosition);
    }
    _isBitSet(elementIndex, bitPosition) {
        if (typeof elementIndex == "object") {
            let bytes = elementIndex
            // Round down the targetByte
            let targetByte = Math.floor((32 - bitPosition) / 8);
            let targetBit = (bitPosition - 1) % 8;
            let base = bytes[targetByte];
            let result = base & this.MASK[targetBit];
            return (result != 0);
        } else {
            // If not an array, convert it into one
            if (elementIndex > this.size || elementIndex < 0)
                throw new RangeError("Index of: " + elementIndex + " Out of range[0 - " + this.size + "]");
            let bytes = this._getElementAt(elementIndex);
            return this._isBitSet(bytes, bitPosition);
        }
    }
    _isRange1(bytes) {
        if (this._isBitSet(bytes, 6) && this._isBitClear(bytes, 7))
            return true;
        return false;
    }
    _isRange2(bytes) {
        if (this._isBitClear(bytes, 6) && this._isBitSet(bytes, 7))
            return true;
        return false;
    }
    _isRange3(bytes) {
        if (this._isBitSet(bytes, 6) && this._isBitSet(bytes, 7))
            return true;
        return false;
    }
    _isDifferentValue(bytes) {
        return this._isBitSet(bytes, 8);
    }

    _isRevisedAutomatically(bytes) {
        if (this._isBitSet(bytes, 9) &&
            this._isBitClear(bytes, 10) &&
            this._isBitClear(bytes, 11))
            return true;
        return false;
    }
    _isRevisedInteractively(bytes) {
        if (this._isBitClear(bytes, 9) &&
            this._isBitSet(bytes, 10) &&
            this._isBitClear(bytes, 11))
            return true;
        return false;
    }
    _isRevisedManually(bytes) {
        if (this._isBitSet(bytes, 9) &&
            this._isBitSet(bytes, 10) &&
            this._isBitClear(bytes, 11))
            return true;
        return false;
    }
    _isRevisedToOriginalAccepted(bytes) {
        if (this._isBitClear(bytes, 9) &&
            this._isBitClear(bytes, 10) &&
            this._isBitSet(bytes, 11))
            return true;
        return false;
    }
    _isReplaceLinearInterpolation(bytes) {
        if (this._isBitSet(bytes, 12) &&
            this._isBitClear(bytes, 13) &&
            this._isBitClear(bytes, 14) &&
            this._isBitClear(bytes, 15))
            return true;
        return false;
    }
    _isReplaceManualChange(bytes) {
        if (this._isBitClear(bytes, 12) &&
            this._isBitSet(bytes, 13) &&
            this._isBitClear(bytes, 14) &&
            this._isBitClear(bytes, 15))
            return true;
        return false;
    }
    _isReplaceWithMissing(bytes) {
        if (this._isBitSet(bytes, 12) &&
            this._isBitSet(bytes, 13) &&
            this._isBitClear(bytes, 14) &&
            this._isBitClear(bytes, 15))
            return true;
        return false;
    }
    _isReplaceGraphicalChange(bytes) {
        if (this._isBitClear(bytes, 12) &&
            this._isBitClear(bytes, 13) &&
            this._isBitSet(bytes, 14) &&
            this._isBitClear(bytes, 15))
            return true;
        return false;
    }
    _getValidity(bytes) {
        if (this._isBitSet(bytes, 2))
            return "OKAY"
        if (this._isBitSet(bytes, 3))
            return "MISSING"
        if (this._isBitSet(bytes, 4))
            return "QUESTIONABLE"
        if (this._isBitSet(bytes, 5))
            return "REJECTED"
        return "UNKNOWN"
    }
    _getRange(bytes) {
        if (this._isRange1(bytes))
            return "RANGE_1"
        if (this._isRange2(bytes))
            return "RANGE_2"
        if (this._isRange3(bytes))
            return "RANGE_3"
        return "NO_RANGE"
    }
    _getReplaceCause(bytes) {
        if (this._isRevisedAutomatically(bytes))
            return "AUTOMATIC"
        if (this._isRevisedInteractively(bytes))
            return "INTERACTIVE"
        if (this._isRevisedManually(bytes))
            return "MANUAL"
        if (this._isRevisedToOriginalAccepted(bytes))
            return "RESTORED"
        return "NONE"
    }
    _getReplaceMethod(bytes) {
        if (this._isReplaceLinearInterpolation(bytes))
            return "LIN_INTERP"
        if (this._isReplaceManualChange(bytes))
            return "EXPLICIT"
        if (this._isReplaceWithMissing(bytes))
            return "MISSING"
        if (this._isReplaceGraphicalChange(bytes))
            return "GRAPHICAL"
        return "NONE"
    }
    _getTestFailed(bytes) {
        let failed = []
        if (this._isBitSet(bytes, 16))
            failed.push("ABSOLUTE_VALUE");
        if (this._isBitSet(bytes, 17))
            failed.push("CONSTANT_VALUE");
        if (this._isBitSet(bytes, 18))
            failed.push("RATE_OF_CHANGE");
        if (this._isBitSet(bytes, 19))
            failed.push("RELATIVE_VALUE");
        if (this._isBitSet(bytes, 20))
            failed.push("DURATION_VALUE");
        if (this._isBitSet(bytes, 21))
            failed.push("NEG_INCREMENT");
        if (this._isBitSet(bytes, 23))
            failed.push("SKIP_LIST");
        if (this._isBitSet(bytes, 25))
            failed.push("USER_DEFINED");
        if (this._isBitSet(bytes, 26))
            failed.push("DISTRIBUTION");
        return failed.length ? failed.join("+") : "NONE"
    }
    getStringDescription(intQuality, columns = false) {
        let bytes = new Uint8Array(4);
        bytes[3] = intQuality & 0xFF;
        bytes[2] = intQuality >> 8 & 0xFF;
        bytes[1] = intQuality >> 16 & 0xFF;
        bytes[0] = intQuality >> 24 & 0xFF;
        if (columns) {
            return {
                "QUALITY_CODE": intQuality,
                "SCREENED_ID": this._isScreened(bytes) ? "SCREENED" : "UNSCREENED",
                "VALIDITY_ID": this._getValidity(bytes),
                "RANGE_ID": this._getRange(bytes),
                "CHANGED_ID": this._isDifferentValue(bytes) ? "MODIFIED" : "ORIGINAL",
                "REPL_CAUSE_ID": this._getReplaceCause(bytes),
                "REPL_METHOD_ID": this._getReplaceMethod(bytes),
                "TEST_FAILED_ID": this._getTestFailed(bytes),
                "PROTECTION_ID": this._isBitSet(bytes, 32) ? "PROTECTED" : "UNPROTECTED"
            }
        }
        if (this._isQualityClear(bytes))
            return "Quality is undetermined";
        let sb = []
        if (this._isScreened(bytes))
            sb.push("Screened");
        else
            sb.push("Not Screened?");
        if (this._isBitSet(bytes, 2)) {
            if (sb.length > 0) sb.push(", ");
            sb.push("Passed tests OK");
        }
        if (this._isBitSet(bytes, 3)) {
            if (sb.length > 0) sb.push(", ");
            sb.push("Set to Missing");
        }
        if (this._isBitSet(bytes, 4)) {
            if (sb.length > 0) sb.push(", ");
            sb.push("Questionable Quality");
        }
        if (this._isBitSet(bytes, 5)) {
            if (sb.length > 0) sb.push(", ");
            sb.push("Rejected Quality");
        }
        if (this._isRange1(bytes)) {
            if (sb.length > 0) sb.push("\n");
            sb.push("Value is between first and second range limit");
        }
        if (this._isRange2(bytes)) {
            if (sb.length > 0) sb.push("\n");
            sb.push("Value is between second and third range limit");
        }
        if (this._isRange3(bytes)) {
            if (sb.length > 0) sb.push("\n");
            sb.push("Value is above third range limit");
        }
        if (this._isDifferentValue(bytes)) {
            if (sb.length > 0) sb.push("\n");
            sb.push("Current value is different from original value");
        }
        if (this._isRevisedAutomatically(bytes)) {
            if (sb.length > 0) sb.push("\n");
            sb.push("Revised automatically by DATCHK or other Process");
        }
        if (this._isRevisedInteractively(bytes)) {
            if (sb.length > 0) sb.push("\n");
            sb.push("Revised interactively with DATVUE or CWMS Verification Editor");
        }
        if (this._isRevisedManually(bytes)) {
            if (sb.length > 0) sb.push("\n");
            sb.push("Manual entry with DATVUE or CWMS Verification Editor");
        }
        if (this._isRevisedToOriginalAccepted(bytes)) {
            if (sb.length > 0) sb.push("\n");
            sb.push("Original value accepted in DATVUE or CWMS Verification Editor");
        }
        if (this._isReplaceLinearInterpolation(bytes)) {
            if (sb.length > 0) sb.push("\n");
            sb.push("Replacement method: linear interpolation");
        }
        if (this._isReplaceManualChange(bytes)) {
            if (sb.length > 0) sb.push("\n");
            sb.push("Replacement method: manual change");
        }
        if (this._isReplaceWithMissing(bytes)) {
            if (sb.length > 0) sb.push("\n");
            sb.push("Replacement method: replace with missing value");
        }
        if (this._isReplaceGraphicalChange(bytes)) {
            if (sb.length > 0) sb.push("\n");
            sb.push("Replacement method: graphical change");
        }
        if (this._isBitSet(bytes, 16)) {
            if (sb.length > 0) sb.push("\n");
            sb.push("Failed Test: Absolute Magnitude");
        }
        if (this._isBitSet(bytes, 17)) {
            if (sb.length > 0) sb.push("\n");
            sb.push("Failed Test: Constant Value");
        }
        if (this._isBitSet(bytes, 18)) {
            if (sb.length > 0) sb.push("\n");
            sb.push("Failed Test: Rate-of-change");
        }
        if (this._isBitSet(bytes, 19)) {
            if (sb.length > 0) sb.push("\n");
            sb.push("Failed Test: Relative Magnitude");
        }
        if (this._isBitSet(bytes, 20)) {
            if (sb.length > 0) sb.push("\n");
            sb.push("Failed Test: Duration-magnitude");
        }
        if (this._isBitSet(bytes, 21)) {
            if (sb.length > 0) sb.push("\n");
            sb.push("Failed Test: Negative Incremental Value");
        }
        if (this._isBitSet(bytes, 23)) {
            if (sb.length > 0) sb.push("\n");
            sb.push("Failed Test: On GAGE list as faulty gage");
        }
        if (this._isBitSet(bytes, 25)) {
            if (sb.length > 0) sb.push("\n");
            sb.push("Failed Test: User-defined Test");
        }
        if (this._isBitSet(bytes, 26)) {
            if (sb.length > 0) sb.push("\n");
            sb.push("Failed Test: Distribution Test");
        }
        if (this._isBitSet(bytes, 32)) {
            if (sb.length > 0) sb.push("\n");
            sb.push("PROTECTED from change or replacement");
        }
        return sb.toString()
    }
    generateColorPrefMap() {
        const output = {};
        const prefs = window.localStorage;
        const defBgColorMap = getDefaultSymbolicBgColorMap();
        const defFgColorMap = getDefaultSymbolicFgColorMap();
        for (const s in defBgColorMap) {
            const fgSb = "qf_color_" + s;
            const bgSb = "qf_bg_color_" + s;
            output[fgSb] = prefs.getItem(fgSb) || defFgColorMap[s];
            output[bgSb] = prefs.getItem(bgSb) || defBgColorMap[s];
        }
        return output;
    }

    getQualityPrefs(rootNode) {
        return window.localStorage.getItem(rootNode + "." + this.name);
    }

    getQualityColorPrefs(rootNode) {
        return window.localStorage.getItem(rootNode + "." + this.name + ".color")
    }

    canEditQuality(appSpecificRootNode) {
        return window.localStorage(`${this.name}.${appSpecificRootNode}.quality_flags_editable`) || true
    }

    canShowQuality(appSpecificRootNode) {
        return window.localStorage.getItem(`${this.name}.${appSpecificRootNode}.show_quality_flags`) || true
    }

    setShowQuality(appSpecificRootNode, showQuality) {
        return window.localStorage.setItem(`${this.name}.${appSpecificRootNode}.show_quality_flags`, showQuality)
    }

    setCanEditQuality(appSpecificRootNode, editQuality) {
        return window.localStorage.setItem(`${this.name}.${appSpecificRootNode}.quality_flags_editable`, editQuality)
    }

    getColoredHtmlSymbolicString(intQuality) {
        return this.getColoredHtmlSymbolicString(intQuality, generateColorPrefMap());
    }

    getColoredHtmlSymbolicString(intQuality, colorMap) {
        const symbolSb = this.getSymbolicString(intQuality) + this.getSymbolicRevisedString(intQuality);
        return this.convertToColoredHtml(symbolSb, colorMap);
    }
    getSymbolicString(intQuality) {
        return this.getString(intQuality, 4);
    }

    getString(intQuality, stringType) {
        let n = intQuality;
        let bytes = new Uint8Array(4);
        bytes[3] = (n & 0xFF);
        bytes[2] = (n >> 8 & 0xFF);
        bytes[1] = (n >> 16 & 0xFF);
        bytes[0] = (n >> 24 & 0xFF);
        if (stringType === 0)
            return this.pad(n.toString(2), 0);
        if (stringType === 2)
            return this.pad(n.toString(16), 2);
        if (stringType === 1)
            return this.pad(n.toString(8), 1);
        if (stringType === 3)
            return n.toString();
        let qualString = "";
        if (stringType === 4) {
            if (this._isQualityClear(bytes)) {
                qualString += " * ";
            } else {
                if (isBitSet(bytes, 32))
                    qualString += "P";
                else
                    qualString += " ";
                if (isBitSet(bytes, 3))
                    qualString += "M";
                if (isBitSet(bytes, 5))
                    qualString += "R";
                if (isBitSet(bytes, 4))
                    qualString += "Q";
                if (qualString.length === 1)
                    qualString += " ";
            }
            return qualString;
        }
        if (stringType === 5) {
            if (isAccepted(bytes))
                qualString += "A";
            else if (isInterpolated(bytes))
                qualString += "I";
            else if (isKeyboardInput(bytes))
                qualString += "K";
            else if (isGraphicalEstimate(bytes))
                qualString += "E";
            else qualString += " ";
            return qualString;
        }
        if (stringType === 6) {
            if (isBitSet(bytes, 16))
                qualString += "AM";
            if (isBitSet(bytes, 17)) {
                if (qualString.length > 0)
                    qualString += ",";
                qualString += "CV";
            }
            if (isBitSet(bytes, 18)) {
                if (qualString.length > 0)
                    qualString += ",";
                qualString += "RC";
            }
            if (isBitSet(bytes, 19)) {
                if (qualString.length > 0)
                    qualString += ",";
                qualString += "RM";
            }
            if (isBitSet(bytes, 20)) {
                if (qualString.length > 0)
                    qualString += ",";
                qualString += "DM";
            }
            if (isBitSet(bytes, 21)) {
                if (qualString.length > 0)
                    qualString += ",";
                qualString += "NI";
            }
            if (isBitSet(bytes, 23)) {
                if (qualString.length > 0)
                    qualString += ",";
                qualString += "GL";
            }
            if (isBitSet(bytes, 25)) {
                if (qualString.length > 0)
                    qualString += ",";
                qualString += "UD";
            }
            if (isBitSet(bytes, 26)) {
                if (qualString.length > 0)
                    qualString += ",";
                qualString += "DS";
            }
            return qualString;
        }
        return n.toString(16);
    }
    pad(string, stringType) {
        const shouldBe = [32, 11, 8];
        if (stringType === 3)
            return string;
        const have = string.length;
        const need = shouldBe[stringType] - have;
        return this.PADDING[need] + string;
    }
    // Set and Clear bits, takes an int value in and returns the new int value
    setScreened_int(intQuality) {
        return this.setBit_int(intQuality, 1);
    }
    clearScreened_int(intQuality) {
        return this.clearBit_int(intQuality, 1);
    }

    isQuestion_int(intQuality) {
        return (this.isBitSet_int(intQuality, 1) &&
            this.isBitSet_int(intQuality, 4));
    }
    clearQuestion_int(intQuality) {
        return this.setBit_int(this.clearBit_int(intQuality, 4), 1);
    }
    setQuestion_int(intQuality) {
        let tmp = this.setBit_int(intQuality, 4);
        tmp = this.clearBit_int(tmp, 2);
        tmp = this.clearBit_int(tmp, 3);
        tmp = this.clearBit_int(tmp, 5);
        return this.setBit_int(tmp, 1);
    }
    clearReject_int(intQuality) {
        return this.setBit_int(this.clearBit_int(intQuality, 5), 1);
    }
    setReject_int(intQuality) {
        let tmp = this.setBit_int(intQuality, 5);
        tmp = this.clearBit_int(tmp, 2);
        tmp = this.clearBit_int(tmp, 4);
        tmp = this.clearBit_int(tmp, 3);
        return this.setBit_int(tmp, 1);
    }
    clearRange_int(intQuality) {
        return this.clearBit_int(this.clearBit_int(intQuality, 6), 7);
    }
    setRange0_int(intQuality) {
        return this.clearBit_int(this.clearBit_int(intQuality, 6), 7);
    }
    setRange1_int(intQuality) {
        return this.clearBit_int(this.setBit_int(intQuality, 6), 7);
    }
    setRange2_int(intQuality) {
        return this.setBit_int(this.clearBit_int(intQuality, 6), 7);
    }
    setRange3_int(intQuality) {
        return this.setBit_int(this.setBit_int(intQuality, 6), 7);
    }
    clearDifferentValue_int(intQuality) {
        return this.clearBit_int(intQuality, 8);
    }
    setDifferentValue_int(intQuality) {
        return this.setBit_int(intQuality, 8);
    }
    clearHowRevised_int(intQuality) {
        let tmp = this.clearBit_int(intQuality, 9);
        tmp = this.clearBit_int(tmp, 10);
        return this.clearBit_int(tmp, 11);
    }
    clearReplaceMethod_int(intQuality) {
        let tmp = this.clearBit_int(intQuality, 12);
        tmp = this.clearBit_int(tmp, 13);
        tmp = this.clearBit_int(tmp, 14);
        return this.clearBit_int(tmp, 15);
    }
    setReplaceNoRevision_int(intQuality) {
        return this.clearReplaceMethod_int(intQuality);
    }
    setNoRevision_int(intQuality) {
        let tmp = this.clearHowRevised_int(intQuality);
        return this.clearReplaceMethod_int(tmp);
    }
    setRevisedAutomatically_int(intQuality) {
        let tmp = this.setOkay_int(intQuality);
        tmp = this.setDifferentValue_int(tmp);
        tmp = this.setBit_int(intQuality, 9);
        tmp = this.clearBit_int(tmp, 10);
        return this.clearBit_int(tmp, 11);
    }
    isRevisedAutomaticallyCheckAllBits_int(intQuality) {
        return (this.isBitSet_int(intQuality, 1) &&
            this.isBitSet_int(intQuality, 2) &&
            this.isBitClear_int(intQuality, 3) &&
            this.isBitClear_int(intQuality, 4) &&
            this.isBitClear_int(intQuality, 5) &&
            this.isBitSet_int(intQuality, 8) &&

            this.isRevisedAutomatically_int(intQuality));
    }
    setRevisedInteractively_int(intQuality) {
        let tmp = this.setOkay_int(intQuality);
        tmp = this.setDifferentValue_int(intQuality);
        tmp = this.clearBit_int(intQuality, 9);
        tmp = this.setBit_int(tmp, 10);
        return this.clearBit_int(tmp, 11);
    }
    setRevisedManually_int(intQuality) {
        let tmp = this.setOkay_int(intQuality);
        tmp = this.setDifferentValue_int(intQuality);
        tmp = this.setBit_int(intQuality, 9);
        tmp = this.setBit_int(tmp, 10);
        return this.clearBit_int(tmp, 11);
    }
    setRevisedToOriginalAccepted_int(intQuality) {
        let tmp = this.setOkay_int(intQuality);
        tmp = this.clearBit_int(intQuality, 9);
        tmp = this.clearBit_int(tmp, 10);
        tmp = this.setBit_int(tmp, 11);
        return this.setReplaceNoRevision_int(tmp);
    }
    setReplaceLinearInterpolation_int(intQuality) {
        let tmp = this.setOkay_int(intQuality);
        tmp = this.setDifferentValue_int(intQuality);
        tmp = this.setBit_int(intQuality, 12);
        tmp = this.clearBit_int(tmp, 13);
        tmp = this.clearBit_int(tmp, 14);
        return this.clearBit_int(tmp, 15);
    }

    setReplaceManualChange_int(intQuality) {
        let tmp = this.setOkay_int(intQuality);
        tmp = this.setDifferentValue_int(intQuality);
        tmp = this.clearBit_int(intQuality, 12);
        tmp = this.setBit_int(tmp, 13);
        tmp = this.clearBit_int(tmp, 14);
        return this.clearBit_int(tmp, 15);
    }
    setReplaceGraphicalChange_int(intQuality) {
        let tmp = this.setOkay_int(intQuality);
        tmp = this.setDifferentValue_int(intQuality);
        tmp = this.clearBit_int(intQuality, 12);
        tmp = this.clearBit_int(tmp, 13);
        tmp = this.setBit_int(tmp, 14);
        return this.clearBit_int(tmp, 15);
    }
    setReplaceWithMissing_int(intQuality) {
        let tmp = this.setMissing_int(intQuality);
        tmp = this.setDifferentValue_int(intQuality);
        tmp = this.setBit_int(intQuality, 12);
        tmp = this.setBit_int(tmp, 13);
        tmp = this.clearBit_int(tmp, 14);
        return this.clearBit_int(tmp, 15);
    }

    setMissing_int(intQuality) {
        let tmp = this.setBit_int(intQuality, 3);
        tmp = this.clearBit_int(tmp, 2);
        tmp = this.clearBit_int(tmp, 4);
        tmp = this.clearBit_int(tmp, 5);
        return this.setBit_int(tmp, 1);
    }
    clearMissing_int(intQuality) {
        return this.setBit_int(this.clearBit_int(intQuality, 3), 1);
    }
    clearOkay_int(intQuality) {
        return this.setBit_int(this.clearBit_int(intQuality, 2), 1);
    }
    
    setOkay_int(intQuality) {
        let tmp = this.setBit_int(intQuality, 2);
        tmp = this.clearBit_int(tmp, 3);
        tmp = this.clearBit_int(tmp, 4);
        tmp = this.clearBit_int(tmp, 5);
        return this.setBit_int(tmp, 1);
    }

    clearAbsoluteMagnitude_int(intQuality) {
        return this.clearBit_int(intQuality, 16);
    }

    setAbsoluteMagnitude_int(intQuality) {
        return this.setBit_int(intQuality, 16);
    }

    clearConstantValue_int(intQuality) {
        return this.clearBit_int(intQuality, 17);
    }

    setConstantValue_int(intQuality) {
        return this.setBit_int(intQuality, 17);
    }
    
    clearRateOfChange_int(intQuality) {
        return this.clearBit_int(intQuality, 18);
    }
    setRateOfChange_int(intQuality) {
        return this.setBit_int(intQuality, 18);
    }
    isRelativeMagnitude_int(intQuality) {
        return this.isBitSet_int(intQuality, 19);
    }
    clearRelativeMagnitude_int(intQuality) {
        return this.clearBit_int(intQuality, 19);
    }
    setRelativeMagnitude_int(intQuality) {
        return this.setBit_int(intQuality, 19);
    }
    clearDurationMagnitude_int(intQuality) {
        return this.clearBit_int(intQuality, 20);
    }
    setDurationMagnitude_int(intQuality) {
        return this.setBit_int(intQuality, 20);
    }
    clearNegativeIncremental_int(intQuality) {
        return this.clearBit_int(intQuality, 21);
    }
    setNegativeIncremental_int(intQuality) {
        return this.setBit_int(intQuality, 21);
    }
    clearAllTest_int(intQuality) {
        let tmp = this.clearBit_int(intQuality, this.ABSOLUTEMAGNITUDE_BIT);
        tmp = this.clearBit_int(tmp, this.CONSTANTVALUE_BIT)
        tmp = this.clearBit_int(tmp, this.RATEOFCHANGE_BIT)
        tmp = this.clearBit_int(tmp, this.RELATIVEMAGNITUDE_BIT)
        tmp = this.clearBit_int(tmp, this.DURATIONMAGNITUDE_BIT)
        tmp = this.clearBit_int(tmp, this.NEGATIVEINCREMENTAL_BIT)
        tmp = this.clearBit_int(tmp, this.GAGELIST_BIT)
        tmp = this.clearBit_int(tmp, this.USER_DEFINED_TEST_BIT)
        return this.clearBit_int(tmp, this.DISTRIBUTIONTEST_BIT)
    }
    clearAllRevised_int(intQuality) {
        let tmp = this.clearBit_int(intQuality, 9);
        tmp = this.clearBit_int(tmp, 10);
        return this.clearBit_int(tmp, 11);
    }
    clearUserDefinedTest_int(intQuality) {
        return this.clearBit_int(intQuality, 25);
    }
    setUserDefinedTest_int(intQuality) {
        return this.setBit_int(intQuality, 25);
    }
    clearDistributionTest_int(intQuality) {
        return this.clearBit_int(intQuality, 26);
    }
    setDistributionTest_int(intQuality) {
        return this.setBit_int(intQuality, 26);
    }
    clearGageList_int(intQuality) {
        return this.clearBit_int(intQuality, 23);
    }
    setGageList_int(intQuality) {
        return this.setBit_int(intQuality, 23);
    }
    clearProtected_int(intQuality) {
        return this.setBit_int(this.clearBit_int(intQuality, 32), 1);
    }
    setProtected_int(intQuality) {
        return this.setBit_int(this.setBit_int(intQuality, 32), 1);
    }
}
