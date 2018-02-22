import React, { PureComponent } from 'react';
import { Paper, Toolbar, Avatar, Icon } from 'material-ui';
import ExpansionPanel, {
    ExpansionPanelSummary,
    ExpansionPanelDetails,
} from 'material-ui/ExpansionPanel';

const FeedbackItem = ({ children, label }) => (
    <div style={{ marginRight: '10px', whiteSpace: label === 'Message' ? 'wrap' : 'nowrap' }}>
        <h4>{label}</h4>
        <p>{children}</p>
    </div>
);

export default class Feedback extends PureComponent {
    render() {
        const { data } = this.props;
        return (
            <div
                style={{
                    width: '100%', marginTop: '2.5em',
                }}
            >   <Paper>
                    <Toolbar>
                        User feedback
                    </Toolbar>
                </Paper>
                {data.map(({ key, item }) => {
                    const {
                        appVersion, device, email, message, name, os,
                    } = item;
                    return (
                        <ExpansionPanel key={key}>
                            <ExpansionPanelSummary
                                expandIcon={<Icon>keyboard_arrow_down</Icon>}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Avatar>{name.substr(0, 1)}</Avatar>
                                    <div style={{ marginLeft: '10px' }}>{message.substr(0, 100)}...</div>
                                </div>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails style={{ flexWrap: 'wrap', justifyContent: 'space-between' }}>
                                <FeedbackItem label="Name">
                                    {name}
                                </FeedbackItem>
                                <FeedbackItem label="E-mail">
                                    {email}
                                </FeedbackItem>
                                <FeedbackItem label="App Version">
                                    {appVersion}
                                </FeedbackItem>
                                <FeedbackItem label="Device">
                                    {device}
                                </FeedbackItem>
                                <FeedbackItem label="OS Version">
                                    {os}
                                </FeedbackItem>
                                <FeedbackItem label="Message">
                                    {message}
                                </FeedbackItem>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                    );
                })}
            </div>
        );
    }
}
