export interface TableInfo {
    tableInfo: TableInfoElement[];
}

export interface TableInfoElement {
    tableName: string;
    columns: TableInfoColumn[];
}

export interface TableInfoColumn {
    columnName: string;
    dataType: string;
    isNullable: boolean;
}